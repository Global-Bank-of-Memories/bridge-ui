import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '../wallet-base';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { AccountTransactionType } from '@concordium/common-sdk/lib/types';
import { CcdAmount } from '@concordium/common-sdk/lib/types/ccdAmount';
import { environment } from '@environments/environment';
import { BRIDGE_CONTRACT_RAW_SCHEMA } from '@shared/models/concordium.model';
import { WalletApi } from '@concordium/browser-wallet-api-helpers/lib/wallet-api-types';
import * as url from 'url';

@Injectable({
	providedIn: 'root'
})
export class ConcordiumService extends WalletBaseService {
	provider: WalletApi;

	public walletConnected: Subject<boolean> = new Subject<boolean>();
	public ethereum = (window as any).ethereum;

	public async getConcordiumProvider(): Promise<void> {
		this.provider = await detectConcordiumProvider();
	}

	public getWalletData(): Observable<any> {
		return this.getWallet().pipe(
			switchMap(walletId => forkJoin([of(walletId), this.getBalance(walletId)])),
			map(([walletId, balance]) => {
				const wallet = { walletId, balance };
				WalletBaseService.updateWalletState('cnc', wallet);
				return wallet;
			})
		);
	}

	protected getBalance(walletId: string): Observable<any> {
		return this.httpClient
			.post(`${environment.concordiumService}/invokeContract/getBalanceOf`, {
				parameters: [
					{
						address: {
							Account: [walletId]
						},
						token_id: ''
					}
				]
			})
			.pipe(
				filter(Boolean),
				map(balance => Number(balance) / 10 ** 7)
			);
	}

	public getDepositParams(transactionHash: string): Observable<any> {
		return this.httpClient
			.post(`${environment.concordiumService}/invokeContract/getDepositParams`, { hash: transactionHash })
			.pipe(filter(Boolean));
	}

	protected getWallet(): Observable<any> {
		return from(detectConcordiumProvider()).pipe(switchMap(provider => from(provider.connect())));
	}

	public withdraw(transactionHash: string, walletTo: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('transaction_hash', transactionHash);
		formData.append('destination', walletTo);
		const requests = [];
		environment.bridge.forEach(((api: string) => {
			requests.push(this.httpClient.post(`${api}/stellar/withdraw/concordium`, formData).pipe(filter(Boolean)));
		}));

		return forkJoin(requests);
	}

	public concordiumDeposit(transactionHash: string, walletTo: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('hash', transactionHash);
		formData.append('stellar_address', walletTo);
		const requests = [];
		environment.bridge.forEach(((api: string) => {
			requests.push(this.httpClient.post(`${api}/concordium/deposit`, formData, { responseType: 'text' }).pipe(filter(Boolean)));
		}));

		return forkJoin(requests);
	}

	public async handleWithdraw(transactionHash: string, walletTo: string): Promise<void> {
		WalletBaseService.loading = true;
		WalletBaseService.logger('Starting withdraw...');
		const interval = setInterval(() => {
			this.withdraw(transactionHash, walletTo)
				.pipe(
					catchError(err => {
						clearInterval(interval);
						WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
						WalletBaseService.loading = false;
						return err;
					})
				)
				.subscribe(res => {
					if (res) {
						const withdrawConcordiumResponse = res;
						clearInterval(interval);

						void detectConcordiumProvider()
							.then(provider => {
								if (provider) {
									const CONTRACT_NAME = 'gbm_Bridge';
									const TOKEN_CONTRACT_INDEX = 2945n;
									const CONTRACT_SUB_INDEX = 0n;
									const method = 'withdraw';
									const indexes = [];
									const signatures = [];
									withdrawConcordiumResponse.forEach((response, index) => {
										indexes.push(index);
										signatures.push(Buffer.from(response.signature, 'hex').toJSON().data);
									});
									const parameters = {
										amount: Number(withdrawConcordiumResponse[0].amount),
										expiration: withdrawConcordiumResponse[0].expiration * 1000,
										id: Buffer.from(withdrawConcordiumResponse[0].deposit_id, 'hex').toJSON().data,
										indexes,
										signatures,
										to: {
											Account: [withdrawConcordiumResponse[0].address]
										}
									};
									void provider
										.sendTransaction(
											walletTo,
											AccountTransactionType.Update,
											{
												amount: new CcdAmount(0n),
												address: {
													index: TOKEN_CONTRACT_INDEX,
													subindex: CONTRACT_SUB_INDEX
												},
												receiveName: `${CONTRACT_NAME}.${method}`,
												maxContractExecutionEnergy: 100000n
											},
											parameters,
											BRIDGE_CONTRACT_RAW_SCHEMA,
											0
										)
										.then(txHash => {
											void this.getDepositParams(txHash)
												.toPromise()
												.then(() => {
													WalletBaseService.loading = false;
													WalletBaseService.submitState = SubmitState.SEND_TRANSFER;
													WalletBaseService.logger('Withdraw completed successfully', LOGGER_TYPES.SUCCESS);
												})
												.catch(() => {
													WalletBaseService.loading = false;
													WalletBaseService.logger('Error while checking deposit params', LOGGER_TYPES.ERROR);
												});
										})
										.catch((err) => {
											WalletBaseService.loading = false;
											WalletBaseService.logger('Error while sending transaction', LOGGER_TYPES.ERROR);
										});
								}
							})
							.catch(() => {
								WalletBaseService.loading = false;
								WalletBaseService.logger('Error while getting Concordium provider', LOGGER_TYPES.ERROR);
							});
					}
				});
		}, 1000);
	}

	public withdrawConcordium(transactionHash: string, walletTo: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('transaction_hash', transactionHash);
		formData.append('destination', walletTo);

		return this.httpClient
			.post(`${environment.bridge}/concordium/withdraw/stellar`, formData, { responseType: 'text' })
			.pipe(filter(Boolean));
	}

	public async sendWithdraw(transactionHash: string, walletTo: string): Promise<any> {
		setTimeout(() => (WalletBaseService.loading = true));
		WalletBaseService.logger('Starting withdraw...');
		const interval = setInterval(() => {
			WalletBaseService.loading = true;
			void this.withdrawConcordium(transactionHash, walletTo)
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

	public async deposit(gbmWallet: string, concordiumWallet: string, value: string): Promise<string> {
		const provider = await detectConcordiumProvider();
		const ccdValue = Number(value) * 10 ** 7;
		const CONTRACT_NAME = 'gbm_Bridge';
		const TOKEN_CONTRACT_INDEX = 2945n;
		const CONTRACT_SUB_INDEX = 0n;
		const method = 'deposit';
		const byteArrayAccount = Buffer.from(gbmWallet).toJSON().data;
		const byteArray256Account = Array(256 - byteArrayAccount.length).fill(0);
		Array.prototype.push.apply(byteArray256Account, byteArrayAccount);

		const parameters = {
			amount: Number(ccdValue.toFixed(7)),
			destination: byteArray256Account
		};

		const txHash = provider.sendTransaction(
			concordiumWallet,
			AccountTransactionType.Update,
			{
				amount: new CcdAmount(0n),
				address: {
					index: TOKEN_CONTRACT_INDEX,
					subindex: CONTRACT_SUB_INDEX
				},
				receiveName: `${CONTRACT_NAME}.${method}`,
				maxContractExecutionEnergy: 100000n
			},
			parameters,
			BRIDGE_CONTRACT_RAW_SCHEMA,
			0
		);

		return txHash;
	}

	public async requestAssets(walletId: string): Promise<any> {
		const provider = await detectConcordiumProvider();
		return provider.addCIS2Tokens(walletId, [''], 2928n, 0n);
	}
}
