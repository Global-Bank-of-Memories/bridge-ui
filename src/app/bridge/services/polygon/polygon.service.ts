import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubmitState } from '@bridge/components/bridge-form/bridge-form.model';
import { LoggerDictionary } from '@bridge/components/bridge-logger/bridge-logger.dictionary';
import { LoggerType } from '@bridge/components/bridge-logger/bridge-logger.model';
import { IAccount } from '@bridge/interfaces/account.interfaces';
import { environment } from '@environments/environment';
import { BigNumber } from '@ethersproject/bignumber';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { MetamaskService } from '../assets/metamask/metamask.service';
import { BridgeBase } from '../bridge-base';
import { BridgeDataService } from '../bridge-data.service';

@Injectable({
	providedIn: 'root'
})
export class PolygonService extends BridgeBase {
	constructor(
		protected httpClient: HttpClient,
		private metamaskService: MetamaskService,
		protected bridgeDataService: BridgeDataService
	) {
		super(httpClient, bridgeDataService);
	}

	public getAccount(): Observable<Partial<IAccount>> {
		return this.getWallet().pipe(
			switchMap(walletId => this.getBalance(walletId)),
			tap(() => {
				this.bridgeDataService.setLog(LoggerDictionary.POLYGON_ACC_CONNECTED, LoggerType.SUCCESS);
			})
		);
	}

	protected getWallet(): Observable<any> {
		this.bridgeDataService.setLog(LoggerDictionary.POLYGON_ACC_CONNECTING);
		return this.metamaskService.getMetamaskAccount().pipe(
			catchError(error => {
				this.bridgeDataService.setLog(LoggerDictionary.POLYGON_ACC_FAILED, LoggerType.ERROR);
				return error;
			})
		);
	}

	protected getBalance(walletId: string): Observable<any> {
		return this.bridgeDataService.getPolygonConstants$.pipe(
			switchMap(polygonConstants =>
				of(this.metamaskService.getContract(polygonConstants.abi_token.abi, polygonConstants.token_account))
			),
			withLatestFrom(of(walletId)),
			switchMap(([contract, wid]) => from(contract.methods.balanceOf(wid).call())),
			map(balanceWei => ({
				walletId,
				balance: parseFloat((window as any).Web3.utils.fromWei((Number(balanceWei) * 10 ** 11).toString())).toFixed(7),
				connected: true
			})),
			catchError(error => {
				this.bridgeDataService.setLog(LoggerDictionary.POLYGON_ACC_FAILED, LoggerType.ERROR);
				return error;
			})
		);
	}

	protected deposit(): void {}

	public sendWithdraw(transactionHash: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('transaction_hash', transactionHash);

		return this.httpClient.post(`${environment.bridge}/stellar/withdraw/ethereum`, formData).pipe(filter(Boolean));
	}

	public async withdraw(transactionHash: string, walletTo: string, polygonConstants: any, bridgeConstants: any): Promise<void> {
		this.bridgeDataService.setSubmitState({ title: SubmitState.WITHDRAW, loading: true });
		const interval = setInterval(() => {
			this.sendWithdraw(transactionHash)
				.toPromise()
				.then(async response => {
					let withdrawERC20Request = null as any;
					const ethResponse = await response;

					if (ethResponse) {
						withdrawERC20Request = {
							id: `0x${ethResponse.deposit_id}`,
							expiration: BigNumber.from(ethResponse.expiration),
							recipient: walletTo || '',
							amount: ethResponse.amount,
							token: ethResponse.token
						};
					}

					const bridgeContract = this.metamaskService.getContract(
						polygonConstants.abi_bridge.abi,
						polygonConstants.bridge_account
					);
					const indexes: number[] = [];
					const signatures: Buffer[] = [];

					for (let i = 0; i < bridgeConstants.bridge_urls.length; i++) {
						const addressSigner = await bridgeContract.methods.signers(i).call();
						indexes.push(i);
						signatures.push(
							Buffer.from(addressSigner === ethResponse['address'] ? ethResponse['signature'] : '', 'hex')
						);
					}

					await bridgeContract.methods
						.withdrawERC20(withdrawERC20Request, signatures, indexes)
						.send({ from: walletTo || '' });
				})
				.catch(err => {
					clearInterval(interval);
					this.bridgeDataService.setSubmitState({ title: SubmitState.WITHDRAW, loading: false });
				});
		}, 1000);
	}

	private async handleWithdraw(ethResponse, walletTo, polygonConstants, bridgeConstants): Promise<any> {
		let withdrawERC20Request = null as any;

		if (ethResponse) {
			withdrawERC20Request = {
				id: `0x${ethResponse.deposit_id}`,
				expiration: BigNumber.from(ethResponse.expiration),
				recipient: walletTo || '',
				amount: ethResponse.amount,
				token: ethResponse.token
			};
		}

		const bridgeContract = this.metamaskService.getContract(
			polygonConstants.abi_bridge.abi,
			polygonConstants.bridge_account
		);
		const indexes: number[] = [];
		const signatures: Buffer[] = [];

		for (let i = 0; i < bridgeConstants.bridge_urls.length; i++) {
			const addressSigner = await bridgeContract.methods.signers(i).call();
			indexes.push(i);
			signatures.push(Buffer.from(addressSigner === ethResponse['address'] ? ethResponse['signature'] : '', 'hex'));
		}

		await bridgeContract.methods
			.withdrawERC20(withdrawERC20Request, signatures, indexes)
			.send({ from: walletTo || '' });
	}
}
