import _ from 'lodash';
import CryptoJS from 'crypto-js';
import StellarHDWallet from 'stellar-hd-wallet';
import StellarSdk, { Asset, Keypair, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { arrayify, zeroPad } from '@ethersproject/bytes';
import { BigNumber } from '@ethersproject/bignumber';
import { Buffer } from 'buffer';
import { catchError, delay, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, from, Observable, of, Subject, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { GBM_DESTINATION_PUBLIC_WALLET_ID, GBM_NETWORK_PASSPHRASE } from './gbm.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '../wallet-base';
import { LoggerDictionary } from '@home/components/logger/logger.dictionary';
import { PolygonService, validatorUrls } from '../polygon/polygon.service';
import { ToastService } from '@shared/components/toast/toast.service';

window.Buffer = Buffer;

interface ISignaturesIndexes {
	indexes: number[];
	signatures: Buffer[];
}

@Injectable({
	providedIn: 'root'
})
export class GbmService extends WalletBaseService {
	public transaction!: any;
	private stopPolling = new Subject();

	constructor(
		protected toastService: ToastService,
		protected httpClient: HttpClient,
		private polygonService: PolygonService
	) {
		super(toastService, httpClient);
	}

	public getWalletData(): Observable<any> {
		WalletBaseService.logger(LoggerDictionary.CONNECTING_WALLET);
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/wallet`).pipe(
			filter(Boolean),
			map((res: any) => {
				const wallet = {
					walletId: res?.wallet?.public_key || '',
					balance: res?.wallet?.balance || '',
					connected: true
				};
				WalletBaseService.updateWalletState('gbm', wallet);
				return wallet;
			}),
			catchError(err => {
				WalletBaseService.emptyState = true;
				return err;
			})
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

	public sendTransaction(xdr: string): Observable<any> {
		WalletBaseService.logger(LoggerDictionary.GETTING_TRANSACTION_HASH, LOGGER_TYPES.DEFAULT);
		return this.httpClient.post(`${environment.gbmApiUrl}/bridge/stellar/transaction`, { transaction_xdr: xdr });
	}

	public sendTransfer(fromValue: string, isConcordium = false): Observable<string> {
		const server = new Server(environment.stellar);
		const fromWallet = WalletBaseService.state.find(wallet => wallet.from && wallet.selected);
		const toWallet = WalletBaseService.state.find(wallet => !wallet.from && wallet.selected);
		const sourceKeypair = Keypair.fromPublicKey(fromWallet?.walletId || '');
		const sourcePublicKey = sourceKeypair.publicKey();

		if (isConcordium) {
			return forkJoin([from(server.loadAccount(sourcePublicKey)), from(server.fetchBaseFee())]).pipe(
				map(([acc, baseFee]): string => {
					this.transaction = new TransactionBuilder(acc, {
						fee: String(baseFee),
						networkPassphrase: GBM_NETWORK_PASSPHRASE
					})
						.addOperation(
							Operation.payment({
								destination: GBM_DESTINATION_PUBLIC_WALLET_ID,
								asset: Asset.native(),
								amount: fromValue.toString()
							})
						)
						.setTimeout(0)
						.build();

					return this.transaction.toEnvelope().toXDR('base64');
				}),
				catchError((error): string => {
					this.toastService.addAlertDanger({
						header: 'GBM Bridge Gateway',
						body: _.get(error, 'message', 'Unknown gbm bridge error')
					});

					return error;
				})
			);
		}

		const keyArray = zeroPad(arrayify(toWallet?.walletId || ''), 32);

		return forkJoin([from(server.loadAccount(sourcePublicKey)), from(server.fetchBaseFee())]).pipe(
			map(([acc, baseFee]): string => {
				this.transaction = new TransactionBuilder(acc, {
					fee: String(baseFee),
					networkPassphrase: GBM_NETWORK_PASSPHRASE
				})
					.addOperation(
						Operation.payment({
							destination: GBM_DESTINATION_PUBLIC_WALLET_ID,
							asset: Asset.native(),
							amount: fromValue.toString()
						})
					)
					.addMemo(new StellarSdk.Memo.hash(Buffer.from(keyArray)))
					.setTimeout(0)
					.build();

				return this.transaction.toEnvelope().toXDR('base64');
			}),
			catchError((error): string => {
				this.toastService.addAlertDanger({
					header: 'GBM Bridge Gateway',
					body: _.get(error, 'message', 'Unknown gbm bridge error')
				});

				return error;
			})
		);
	}

	public signTransaction(passphrase: string): string {
		try {
			WalletBaseService.logger(LoggerDictionary.SIGNING_TRANSACTION);
			const secret = StellarHDWallet.fromMnemonic(passphrase, GBM_NETWORK_PASSPHRASE);
			const source = Keypair.fromSecret(secret.getSecret(0));
			this.transaction.sign(source);
			return this.transaction.toEnvelope().toXDR('base64');
		} catch (err) {
			WalletBaseService.logger(`${LoggerDictionary.SIGNING_TRANSACTION_FAILED}, ${err}`, LOGGER_TYPES.ERROR);
			return '';
		}
	}

	public withdraw(transactionHash: string): Observable<any> {
		const formData: FormData = new FormData();
		formData.append('transaction_hash', transactionHash);

		return this.httpClient.post(`${environment.bridge}/stellar/withdraw/ethereum`, formData).pipe(filter(Boolean));
	}

	public async handleWithdraw(transactionHash: string, walletTo: string): Promise<void> {
		WalletBaseService.loading = true;
		WalletBaseService.logger('Starting withdraw...');
		const interval = setInterval(() => {
			this.withdraw(transactionHash)
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
						const withdrawEthereumResponse = res;
						clearInterval(interval);

						let withdrawERC20Request = null as any;

						if (withdrawEthereumResponse) {
							withdrawERC20Request = {
								id: `0x${withdrawEthereumResponse.deposit_id}`,
								expiration: BigNumber.from(withdrawEthereumResponse.expiration),
								recipient: walletTo || '',
								amount: withdrawEthereumResponse.amount,
								token: withdrawEthereumResponse.token
							};
						}

						void this.polygonService
							.getBridgeAbi()
							.toPromise()
							.then(async abiRes => {
								WalletBaseService.logger('Getting bridge abi...');
								const bridgeContract = this.polygonService.getContract(
									abiRes.abi,
									'0x18b11A6E4213e5b9B94c97c2A165F889faa3D7C4'
								);

								const indexes: number[] = [];
								const signatures: Buffer[] = [];

								for (let i = 0; i < validatorUrls.length; i++) {
									const addressSigner = await bridgeContract.methods.signers(i).call();
									indexes.push(i);
									signatures.push(
										Buffer.from(
											addressSigner === withdrawEthereumResponse['address']
												? withdrawEthereumResponse['signature']
												: '',
											'hex'
										)
									);
								}

								WalletBaseService.logger('Please confirm the transaction in metamask', LOGGER_TYPES.WARNING);

								const rs = bridgeContract.methods
									.withdrawERC20(withdrawERC20Request, signatures, indexes)
									.send({ from: walletTo || '' })
									.then(() => {
										WalletBaseService.loading = false;
										WalletBaseService.submitState = SubmitState.SEND_TRANSFER;
										WalletBaseService.logger('Withdraw completed successfully', LOGGER_TYPES.SUCCESS);
									})
									.catch(() => {
										WalletBaseService.loading = false;
										WalletBaseService.logger('User refused transaction or something went wrong', LOGGER_TYPES.ERROR);
									});

								return rs;
							})
							.catch(() => {
								WalletBaseService.loading = false;
								WalletBaseService.logger('Getting abi failed or contract refused it', LOGGER_TYPES.ERROR);
							});
					}
				});
		}, 1000);
	}

	private sendTransactionByBridgeContract(
		contract: any,
		ethResponse: any,
		signatures: any,
		indexes: any,
		walletTo: string
	): Observable<any> {
		return from(contract.methods.withdrawERC20(ethResponse, signatures, indexes).send({ from: walletTo })).pipe(
			catchError(err => {
				WalletBaseService.logger(LoggerDictionary.USER_REJECT_OR_FUNDS, LOGGER_TYPES.ERROR);
				WalletBaseService.loading = false;
				return err;
			})
		);
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
			const mnemonic = !_.isEmpty(descryptedData) ? descryptedData[0].split(':') : '';

			return !_.isEmpty(mnemonic) ? mnemonic[1] : '';
		} catch (err) {
			WalletBaseService.logger(LoggerDictionary.INCORRECT_PASSWORD, LOGGER_TYPES.ERROR);
			return '';
		}
	}

	private getIndexesAndSignatures(contract: any, ethResponse: any): ISignaturesIndexes {
		const indexes: number[] = [];
		const signatures: Buffer[] = [];

		validatorUrls.forEach((_item, index) => {
			contract.methods
				.signers(index)
				.call()
				.then((addressSigner: string) => {
					indexes.push(index);
					signatures.push(Buffer.from(addressSigner === ethResponse['address'] ? ethResponse['signature'] : '', 'hex'));
				});
		});

		return {
			indexes,
			signatures
		};
	}

	protected getBalance(): any {}
	protected getWallet(): any {}
}
