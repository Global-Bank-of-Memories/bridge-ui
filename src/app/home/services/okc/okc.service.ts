import * as _ from 'lodash';
import { BridgeService } from '../bridge/bridge.service';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '../wallet-base';
import { environment } from '@environments/environment';
import StellarSdk, { Keypair, TransactionBuilder } from 'stellar-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { GbmService } from '../gbm/gbm.service';
import { LoggerDictionary } from '@home/components/logger/logger.dictionary';
import { GBM_NETWORK_PASSPHRASE, WGBM_OKEX_TOKEN_ADDRESS } from '../gbm/gbm.model';
import StellarHDWallet from 'stellar-hd-wallet';
import CryptoJS from 'crypto-js';

export const validatorUrls = [environment.bridge];

@Injectable({
	providedIn: 'root'
})
export class OkcService extends WalletBaseService {
	public ethereum = (window as any).ethereum;
	public xdr = '';
	public transaction!: any;

	constructor(
		protected toastService: ToastService,
		protected httpClient: HttpClient,
		private bridgeService: BridgeService
	) {
		super(toastService, httpClient);
	}

	public withdraw(transactionHash: string, logIndex: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('transaction_hash', transactionHash);
		formData.append('log_index', logIndex);

		return this.httpClient
			.post(`${environment.bridge}/okx/withdraw/stellar`, formData, { responseType: 'text' })
			.pipe(filter(Boolean));
	}

	public getWalletData(): Observable<any> {
		return this.getWallet().pipe(
			switchMap(walletId => forkJoin([of(walletId), this.getBalance(of(walletId))])),
			map(([walletId, balance]) => {
				const wallet = { walletId, balance, connected: true };
				WalletBaseService.updateWalletState('okc', wallet);
				return wallet;
			})
		);
	}

	public getWallet(): Observable<any> {
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

	public async sendWithdraw(transactionHash: string, logIndex: string): Promise<any> {
		setTimeout(() => (WalletBaseService.loading = true));
		WalletBaseService.logger('Starting withdraw...');
		const interval = setInterval(() => {
			WalletBaseService.loading = true;
			void this.withdraw(transactionHash, logIndex)
				.toPromise()
				.then(res => {
					if (res) {
						clearInterval(interval);
						WalletBaseService.xdr = res;
						WalletBaseService.loading = false;
					}
				})
				.catch(err => {
					console.log(err);
					clearInterval(interval);
					WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
					WalletBaseService.loading = false;
				});
		}, 1000);
	}

	public sendTransaction(xdr: string): Observable<any> {
		WalletBaseService.logger(LoggerDictionary.GETTING_TRANSACTION_HASH, LOGGER_TYPES.DEFAULT);
		return this.httpClient.post(`${environment.gbmApiUrl}/bridge/stellar/transaction`, { transaction_xdr: xdr });
	}

	public async sendTransfer(walletFrom: string, walletTo: string, amount: number): Promise<void> {
		const abiRes = await this.getBridgeAbi().toPromise();
		const bridgeContract = this.getContract(abiRes.abi, '0x18b11A6E4213e5b9B94c97c2A165F889faa3D7C4');

		const stellarAccountDecoded = StellarSdk.StrKey.decodeEd25519PublicKey(walletTo);

		const bomValue = Number(amount) * 10 ** 7;

		return bridgeContract.methods
			.depositERC20(WGBM_OKEX_TOKEN_ADDRESS, BigNumber.from(stellarAccountDecoded), BigNumber.from(Number(bomValue.toFixed(7))))
			.send({
				from: walletFrom
			});
	}

	protected getBalance(targetWallet: any): Observable<any> {
		const web3Instance = new (window as any).Web3((window as any).Web3.givenProvider);
		return this.getStellarAbi().pipe(
			switchMap(stellarAbi => of(new web3Instance.eth.Contract(stellarAbi.abi, WGBM_OKEX_TOKEN_ADDRESS))),
			withLatestFrom(targetWallet),
			switchMap(([contract, wallet]) => from(contract.methods.balanceOf(wallet).call())),
			map(balanceWei =>
				parseFloat((window as any).Web3.utils.fromWei((Number(balanceWei) * 10 ** 11).toString())).toFixed(7)
			)
		);
	}

	public getKeychain(): Observable<any> {
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/keychain`).pipe(
			filter(Boolean),
			map((res: any) => _.get(res, 'keychain', ''))
		);
	}

	public sign(password: string): Observable<string> {
		return this.getKeychain().pipe(
			switchMap(keychain => this.sendTransaction(this.signTransaction(this.getMnemonic(keychain, password)))),
			filter(Boolean),
			map(res => {
				const transactionHash = _.get(res, 'data.transaction_hash', '');
				if (!transactionHash) {
					WalletBaseService.logger(LoggerDictionary.TRANSACTION_HASH_FAILED, LOGGER_TYPES.ERROR);
				}

				return transactionHash;
			})
		);
	}

	public signTransaction(passphrase: string): string {
		try {
			WalletBaseService.logger(LoggerDictionary.SIGNING_TRANSACTION);
			const secret = StellarHDWallet.fromMnemonic(passphrase, GBM_NETWORK_PASSPHRASE);
			const source = Keypair.fromSecret(secret.getSecret(0));
			const transaction = TransactionBuilder.fromXDR(WalletBaseService.xdr, GBM_NETWORK_PASSPHRASE);

			transaction.sign(source);
			return transaction.toEnvelope().toXDR('base64');
		} catch (err) {
			WalletBaseService.logger(`${LoggerDictionary.SIGNING_TRANSACTION_FAILED}, ${err}`, LOGGER_TYPES.ERROR);
			return '';
		}
	}

	private getMnemonic(keychain: string, password: string): string {
		try {
			WalletBaseService.logger(LoggerDictionary.GATHERING_DATA_FOR_SIGN);
			let passphrase = password;
			if (password && password.length < 32) {
				while (passphrase.length < 32) {
					passphrase += password;
				}
			}

			let iv = password;
			if (password && password.length < 16) {
				while (iv.length < 16) {
					iv += password;
				}
			}

			const key = CryptoJS.enc.Utf8.parse(passphrase.slice(0, 32));
			const iv1 = CryptoJS.enc.Utf8.parse(iv.slice(0, 16));
			const plainText = CryptoJS.AES.decrypt(keychain, key, {
				keySize: 16,
				iv: iv1,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});

			const descryptedData = plainText.toString(CryptoJS.enc.Utf8).split(',');
			const mnemonicItem = !_.isEmpty(descryptedData) ? descryptedData.find(item => item.includes('mnemonic')) : null;
			const mnemonic = !_.isEmpty(mnemonicItem) ? mnemonicItem.split(':') : '';

			return !_.isEmpty(mnemonic) ? mnemonic[1] : '';
		} catch (err) {
			WalletBaseService.logger(LoggerDictionary.INCORRECT_PASSWORD, LOGGER_TYPES.ERROR);
			return '';
		}
	}

	private async getMetamaskAccount(): Promise<any> {
		return this.ethereum.request({ method: 'eth_requestAccounts' });
	}

	private getStellarAbi(): Observable<any> {
		return this.httpClient.get('./assets/data/stellar.json');
	}

	public getBridgeAbi(): Observable<any> {
		return this.httpClient.get('./assets/data/bridge.json');
	}

	public getContract(abi: any, contractAddress: string): any {
		const web3Instance = new (window as any).Web3((window as any).Web3.givenProvider);
		return new web3Instance.eth.Contract(abi, contractAddress);
	}

	public async requestAssets(): Promise<any> {
		return this.ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: {
					address: WGBM_OKEX_TOKEN_ADDRESS,
					symbol: 'wGBM',
					decimals: 7,
					image: 'https://api.bankofmemories.org/static/gbm-coin-icon.png'
				}
			}
		});
	}
}
