import * as _ from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { WalletBaseService } from '../wallet-base';

@Injectable({
	providedIn: 'root'
})
export class ConcordiumService extends WalletBaseService {
	public ethereum = (window as any).ethereum;

	public getWalletData(): Observable<any> {
		return this.getWallet().pipe(
			switchMap(walletId => forkJoin([of(walletId), this.getBalance(of(walletId))])),
			map(([walletId, balance]) => {
				const wallet = { walletId, balance };
				WalletBaseService.updateWalletState('cnc', wallet);
				return wallet;
			})
		);
	}

	protected getWallet(): Observable<any> {
		return of('--');
	}

	protected getBalance(targetWallet: any): Observable<any> {
		return of('0');
	}

	// TBC
	private async handleConcordium(): Promise<void> {
		// const provider = await detectConcordiumProvider();
		// const accountAddress = await provider.connect();
		// const gRPCProvider = new HttpProvider('http://167.86.71.92:10001');
		// const rpcClient = new JsonRpcClient(gRPCProvider);
		// const param = serializeUpdateContractParameters(
		// 	'gbm_Bridge',
		// 	'balanceOf',
		// 	[
		// 		{
		// 			address: {
		// 				Account: [accountAddress]
		// 			},
		// 			token_id: ''
		// 		}
		// 	],
		// 	toBuffer(BRIDGE_CONTRACT_RAW_SCHEMA, 'base64')
		// );
		// const res = await rpcClient.invokeContract({
		// 	method: 'gbm_Bridge.balanceOf',
		// 	contract: {
		// 		index: BigInt(2928),
		// 		subindex: BigInt(0)
		// 	},
		// 	parameter: param
		// });
		// console.log(res);
		// this.walletState = this.walletState.map(i => {
		// 	if (i.title === 'Concordium') {
		// 		return {
		// 			...i,
		// 			walletId: accountAddress || ''
		// 		};
		// 	}
		// 	return i;
		// });
		// console.log(
		// 	'🚀 ~ file: bridge-wallet.component.ts:34 ~ BridgeWalletComponent ~ chooseWallet ~ accountAddress',
		// 	accountAddress
		// );
		// if (accountAddress != null) {
		// 	setEthereumAccount(accountAddress);
		// }
		// const modalRef = this.modalRef.open(BridgeWalletsModalComponent, {
		// 	centered: true,
		// 	modalDialogClass: 'bridge-wallets-modal'
		// });
	}
}
