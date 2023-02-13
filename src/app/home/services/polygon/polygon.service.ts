import * as _ from 'lodash';
import StellarSdk, { Asset, Keypair, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { arrayify, zeroPad } from '@ethersproject/bytes';
import { BridgeService } from '../bridge/bridge.service';
import { Buffer } from 'buffer';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { forkJoin, from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { WalletBaseService } from '../wallet-base';

window.Buffer = Buffer;

@Injectable({
	providedIn: 'root'
})
export class PolygonService extends WalletBaseService {
	public ethereum = (window as any).ethereum;

	constructor(
		protected toastService: ToastService,
		protected httpClient: HttpClient,
		private bridgeService: BridgeService
	) {
		super(toastService, httpClient);
	}

	public getWalletData(): Observable<any> {
		return this.getWallet().pipe(
			switchMap(walletId => forkJoin([of(walletId), this.getBalance(of(walletId))])),
			map(([walletId, balance]) => {
				const wallet = { walletId, balance, connected: true };
				WalletBaseService.updateWalletState('pgn', wallet);
				return wallet;
			})
		);
	}

	public async sendTransfer(fromValue: string, toValue: string): Promise<void> {
		const server = new Server(environment.bridge);
		const fromWallet = WalletBaseService.state.find(wallet => wallet.from && wallet.selected);
		const toWallet = WalletBaseService.state.find(wallet => !wallet.from && wallet.selected);

		const sourceKeypair = Keypair.fromPublicKey(fromWallet?.walletId || '');
		const sourcePublicKey = sourceKeypair.publicKey();
		const account = await server.loadAccount(sourcePublicKey);

		const fee = await server.fetchBaseFee();
		const keyArray = zeroPad(arrayify(toWallet?.walletId || ''), 32);
		const transaction = new TransactionBuilder(account, {
			fee: String(fee),
			networkPassphrase: 'BankOfMemories.org; November 2020'
		})
			.addOperation(
				Operation.payment({
					destination: 'GCP2WI2EYG2YCAD6IGFN4EHRPZQSPR33BVCTOYLJQTACSDEVO32LQR3S',
					asset: Asset.native(),
					amount: fromValue.toString()
				})
			)
			.addMemo(new StellarSdk.Memo.hash(Buffer.from(keyArray)))
			.setTimeout(0)
			.build();

		const xdr = transaction.toEnvelope().toXDR('base64');
		console.log(xdr);
	}

	public async signTransaction(xdr: string): Promise<void> {
		// const signedTransaction = await signTransaction(xdr, {
		// 	networkPassphrase: process.env.REACT_APP_STELLAR_NETWORK_PASSPHRASE
		// });
		// const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
		// 	signedTransaction,
		// 	process.env.REACT_APP_STELLAR_SERVER_URL
		// );
		// const transactionResult = await server.submitTransaction(transactionToSubmit);
		// return transactionResult.hash;
	}

	protected getWallet(): Observable<any> {
		return from(this.getMetamaskAccount()).pipe(
			filter(Boolean),
			map((account: any) => account[0]),
			catchError(error => {
				this.toastService.addAlertDanger({
					header: 'Metamask Gateway',
					body: _.get(error, 'message', 'Unknown metamask error')
				});

				return error;
			})
		);
	}

	protected getBalance(targetWallet: any): Observable<any> {
		const web3Instance = new (window as any).Web3((window as any).Web3.givenProvider);
		return this.getStellarAbi().pipe(
			switchMap(stellarAbi =>
				of(new web3Instance.eth.Contract(stellarAbi.abi, '0x35aF0399523635635790940A9DFACAa139053cfB'))
			),
			withLatestFrom(targetWallet),
			switchMap(([contract, wallet]) => from(contract.methods.balanceOf(wallet).call())),
			switchMap(balanceWei =>
				parseFloat((window as any).Web3.utils.fromWei((Number(balanceWei) * 10 ** 11).toString())).toFixed(7)
			)
		);
	}

	private async getMetamaskAccount(): Promise<any> {
		return this.ethereum.request({ method: 'eth_requestAccounts' });
	}

	private getStellarAbi(): Observable<any> {
		return this.httpClient.get('./assets/data/stellar.json');
	}
}
