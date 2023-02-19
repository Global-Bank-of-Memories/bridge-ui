import * as _ from 'lodash';
import { BridgeBase } from '../bridge-base';
import { BridgeDataService } from '../bridge-data.service';
import { catchError, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { combineLatest, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerDictionary } from '@bridge/components/bridge-logger/bridge-logger.dictionary';
import { LoggerType } from '@bridge/components/bridge-logger/bridge-logger.model';
import { ToastService } from '@shared/components/toast/toast.service';
import StellarSdk, { Asset, Keypair, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { arrayify, zeroPad } from '@ethersproject/bytes';
import { AccountAliases, AccountTitles } from '@bridge/enums/account.enum';
import { SubmitState } from '@home/services/wallet-base';
import { GbmBridgeBase } from '../gbm-bridge-base';
import { ISubmitState } from '@bridge/components/bridge-form/bridge-form.model';
import { PolygonService } from '../polygon/polygon.service';

@Injectable({
	providedIn: 'root'
})
export class GbmService extends BridgeBase {
	constructor(
		protected httpClient: HttpClient,
		protected bridgeDataService: BridgeDataService,
		private polygonService: PolygonService,
		private toastService: ToastService
	) {
		super(httpClient, bridgeDataService);
	}

	public getAccount(): Observable<any> {
		this.bridgeDataService.setLog(LoggerDictionary.GBM_ACC_CONNECTING);
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/wallet`).pipe(
			filter(Boolean),
			map((res: any) => {
				this.bridgeDataService.setLog(LoggerDictionary.GBM_ACC_CONNECTED, LoggerType.SUCCESS);
				this.bridgeDataService.setLog(LoggerDictionary.INIT_ACC_NOTE, LoggerType.INFO);
				return {
					walletId: res?.wallet?.public_key || '',
					balance: res?.wallet?.balance || '',
					connected: true
				};
			}),
			catchError((err: HttpErrorResponse) => {
				this.bridgeDataService.setLog(LoggerDictionary.GBM_ACC_CONNECTED, LoggerType.ERROR);
				return throwError(err);
			})
		);
	}

	public async gbmFlow(submitState: ISubmitState, fromValue: number, password: string): Promise<void> {
		if (submitState.title === SubmitState.SEND_TRANSFER) {
			this.bridgeDataService.setSubmitState({ title: SubmitState.SEND_TRANSFER, loading: true });
			this.deposit(fromValue)
				.pipe(take(1))
				.subscribe(xdr => {
					this.bridgeDataService.setXDR(xdr);
					this.bridgeDataService.setSubmitState({ title: SubmitState.SIGN, loading: false });
				});

			return;
		}

		if (submitState.title === SubmitState.SIGN) {
			this.bridgeDataService.setSubmitState({ title: SubmitState.SIGN, loading: true });
			this.sign(password)
				.pipe(take(1))
				.subscribe(transactionHash => {
					this.bridgeDataService.setXDR('');
					this.bridgeDataService.setTransactionHash(transactionHash);
					this.bridgeDataService.setSubmitState({ title: SubmitState.WITHDRAW, loading: false });
				});

			return;
		}

		if (submitState.title === SubmitState.WITHDRAW) {
			try {
				const transactionHash = await this.bridgeDataService.transactionHash$.toPromise();
				const accounts = await this.bridgeDataService.operationalAccounts$.toPromise();
				const polygonConstants = await this.bridgeDataService.getPolygonConstants$.toPromise();
				const bridgeConstants = await this.bridgeDataService.getBridgeConstants$.toPromise();
				const accountTo = accounts.find(account => !account.from);
				await this.polygonService.withdraw(transactionHash, accountTo.walletId, polygonConstants, bridgeConstants);
			} catch (err) {
				console.log(err);
			}

			return;
		}
	}

	protected deposit(fromValue: number): Observable<any> {
		this.bridgeDataService.setLog(
			LoggerDictionary.GBM_DEPOSIT_STARTING.replace('%FLOW%', `${AccountTitles.GBM} > ${AccountTitles.POLYGON}`)
		);
		return this.bridgeDataService.operationalAccounts$.pipe(
			withLatestFrom(this.bridgeDataService.stellarConstants$),
			switchMap(([accounts, stellar]) => {
				const stellarConstants = stellar;
				const fromAccount = accounts.find(account => account.from);
				const toAccount = accounts.find(account => !account.from);
				const server = new Server(environment.stellar);
				const sourceKeypair = Keypair.fromPublicKey(fromAccount.walletId || '');
				const sourcePublicKey = sourceKeypair.publicKey();
				const keyArray = zeroPad(arrayify(toAccount.walletId || ''), 32);

				return forkJoin([from(server.loadAccount(sourcePublicKey)), from(server.fetchBaseFee())]).pipe(
					map(([acc, baseFee]): string => {
						const transaction = new TransactionBuilder(acc, {
							fee: String(baseFee),
							networkPassphrase: stellarConstants.network_passphrase
						})
							.addOperation(
								Operation.payment({
									destination: stellarConstants.bridge_account,
									asset: Asset.native(),
									amount: fromValue.toString()
								})
							)
							.addMemo(new StellarSdk.Memo.hash(Buffer.from(keyArray)))
							.setTimeout(0)
							.build();

						return transaction.toEnvelope().toXDR('base64');
					}),
					catchError((error): string => {
						this.bridgeDataService.setLog(
							LoggerDictionary.GBM_DEPOSIT_XDR_FAILED.replace(
								'%FLOW%',
								`${AccountTitles.GBM} > ${AccountTitles.POLYGON}`
							),
							LoggerType.ERROR
						);
						return error;
					})
				);
			}),
			catchError((error): string => {
				this.bridgeDataService.setSubmitState({ title: SubmitState.SEND_TRANSFER, loading: false });
				this.bridgeDataService.setLog(
					LoggerDictionary.GBM_DEPOSIT_FAILED.replace('%FLOW%', `${AccountTitles.GBM} > ${AccountTitles.POLYGON}`),
					LoggerType.ERROR
				);
				return error;
			}),
			tap(() => {
				this.bridgeDataService.setLog(
					LoggerDictionary.GBM_DEPOSIT_XDR_SUCCESS.replace('%FLOW%', `${AccountTitles.GBM} > ${AccountTitles.POLYGON}`),
					LoggerType.SUCCESS
				);
				this.bridgeDataService.setLog(
					LoggerDictionary.GBM_DEPOSIT_SUCCESS.replace('%FLOW%', `${AccountTitles.GBM} > ${AccountTitles.POLYGON}`),
					LoggerType.SUCCESS
				);
				this.bridgeDataService.setLog(LoggerDictionary.GBM_DEPOSIT_NOTE, LoggerType.INFO);
			})
		);
	}

	protected withdraw(): void {}

	protected getBalance(): void {}
	protected getWallet(): void {}
}
