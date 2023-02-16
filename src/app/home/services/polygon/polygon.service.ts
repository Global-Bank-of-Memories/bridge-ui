import * as _ from 'lodash';
import { BridgeService } from '../bridge/bridge.service';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { WalletBaseService } from '../wallet-base';
import { environment } from '@environments/environment';

export const validatorUrls = [environment.bridge];

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

	public getBridgeAbi(): Observable<any> {
		return this.httpClient.get('./assets/data/bridge.json');
	}

	public getContract(abi: any, contractAddress: string): any {
		const web3Instance = new (window as any).Web3((window as any).Web3.givenProvider);
		return new web3Instance.eth.Contract(abi, contractAddress);
	}
}
