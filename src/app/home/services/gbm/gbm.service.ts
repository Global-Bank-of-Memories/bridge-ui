/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import _ from 'lodash';
import StellarHDWallet from 'stellar-hd-wallet';
import StellarSdk, { Asset, Keypair, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { arrayify, zeroPad } from '@ethersproject/bytes';
import { Buffer } from 'buffer';
import {
	catchError,
	delay,
	filter,
	map,
	repeatWhen,
	retry,
	share,
	switchMap,
	takeUntil,
	tap,
	withLatestFrom
} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { defer, forkJoin, from, Observable, of, Subject, throwError, timer } from 'rxjs';
import { GBM_DESTINATION_PUBLIC_WALLET_ID, GBM_NETWORK_PASSPHRASE } from './gbm.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '../wallet-base';
import CryptoJS from 'crypto-js';
import { PolygonService, validatorUrls } from '../polygon/polygon.service';
import { BigNumber } from '@ethersproject/bignumber';
import { LoggerDictionary } from '@home/components/logger/logger.dictionary';

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

	public sendTransfer(fromValue: string): Observable<string> {
		const server = new Server(environment.stellar);
		const fromWallet = WalletBaseService.state.find(wallet => wallet.from && wallet.selected);
		const toWallet = WalletBaseService.state.find(wallet => !wallet.from && wallet.selected);
		const sourceKeypair = Keypair.fromPublicKey(fromWallet?.walletId || '');
		const sourcePublicKey = sourceKeypair.publicKey();
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

		return this.httpClient.post(`${environment.bridge}/stellar/withdraw`, formData).pipe(filter(Boolean));
	}

	public handleWithdraw(transactionHash: string, walletsToExchange: string): void {
		WalletBaseService.loading = true;
		WalletBaseService.logger(LoggerDictionary.STARTING_WITHDRAW);
		const interval = setInterval(() => {
			this.withdraw(transactionHash)
				.pipe(
					switchMap((res): any => {
						clearInterval(interval);
						const withdrawEthereumResponse = res;

						if (_.isEmpty(withdrawEthereumResponse)) {
							WalletBaseService.logger(LoggerDictionary.ETHEREUM_RESPONSE_ERROR, LOGGER_TYPES.ERROR);
							throw throwError(withdrawEthereumResponse);
						}

						return of({
							id: `0x${withdrawEthereumResponse.deposit_id}`,
							expiration: BigNumber.from(withdrawEthereumResponse.expiration),
							recipient: walletsToExchange || '',
							amount: withdrawEthereumResponse.amount,
							token: withdrawEthereumResponse.token
						});
					}),
					withLatestFrom(this.polygonService.getBridgeAbi()),
					switchMap(([ethResponse, abiRes]) => {
						const withdrawEthereumResponse = ethResponse as any;
						WalletBaseService.logger(LoggerDictionary.GETTING_BRIDGE_ABI);
						const bridgeContract = this.polygonService.getContract(
							abiRes.abi,
							'0x18b11A6E4213e5b9B94c97c2A165F889faa3D7C4'
						);

						const indexesSignatures = this.getIndexesAndSignatures(bridgeContract, withdrawEthereumResponse);

						WalletBaseService.logger(LoggerDictionary.CONFIRM_METAMASK, LOGGER_TYPES.WARNING);

						return this.sendTransactionByBridgeContract(
							bridgeContract,
							withdrawEthereumResponse,
							indexesSignatures.signatures,
							indexesSignatures.indexes,
							walletsToExchange
						);
					}),
					filter(Boolean),
					catchError(err => {
						clearInterval(interval);
						WalletBaseService.logger(LoggerDictionary.WITHDRAW_REJECTED, LOGGER_TYPES.ERROR);
						WalletBaseService.logger(LoggerDictionary.SUPPORT, LOGGER_TYPES.WARNING);
						WalletBaseService.loading = false;
						return err;
					})
				)
				.subscribe(() => {
					WalletBaseService.loading = false;
					WalletBaseService.submitState = SubmitState.SEND_TRANSFER;
					WalletBaseService.logger(LoggerDictionary.WITHDRAW_COMPLETED, LOGGER_TYPES.SUCCESS);
				});
		}, 1000);
	}

	private sendTransactionByBridgeContract(
		contract: any,
		ethResponse: any,
		signatures: any,
		indexes: any,
		walletId: string
	): Observable<any> {
		return from(contract.methods.withdrawERC20(ethResponse, signatures, indexes).send({ from: walletId })).pipe(
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
