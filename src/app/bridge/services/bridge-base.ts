import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
import { Keypair, TransactionBuilder } from 'stellar-sdk';
import CryptoJS from 'crypto-js';
import StellarHDWallet from 'stellar-hd-wallet';
import { BridgeDataService } from './bridge-data.service';

@Injectable({
	providedIn: 'root'
})
export abstract class BridgeBase {
	constructor(protected httpClient: HttpClient, protected bridgeDataService: BridgeDataService) {}

	protected abstract getAccount(): Observable<any>;
	protected abstract getWallet(): Observable<any> | void;
	protected abstract getBalance(walletId?: string): Observable<any> | void;
	protected abstract deposit(fromValue: number): Observable<any> | void;

	protected sendTransaction(xdr: string): Observable<any> {
		return this.httpClient.post(`${environment.gbmApiUrl}/bridge/stellar/transaction`, { transaction_xdr: xdr });
	}

	public getKeychain(): Observable<string> {
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/keychain`).pipe(
			filter(Boolean),
			map(res => _.get(res, 'keychain', '')),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	public sign(password: string): Observable<string> {
		return this.getKeychain().pipe(
			withLatestFrom(this.bridgeDataService.stellarConstants$),
			withLatestFrom(this.bridgeDataService.xdr$),
			switchMap(([[keychain, stellarConstants], xdr]) =>
				this.sendTransaction(
					this.signTransaction(xdr, this.getMnemonic(keychain, password), stellarConstants.network_passphrase)
				)
			),
			filter(Boolean),
			map(res => {
				const transactionHash = _.get(res, 'data.transaction_hash', '');

				return transactionHash;
			})
		);
	}

	public signTransaction(xdr: string, passphrase: string, networkPassphrase: string): string {
		try {
			const secret = StellarHDWallet.fromMnemonic(passphrase, networkPassphrase);
			const source = Keypair.fromSecret(secret.getSecret(0));
			const transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase);
			transaction.sign(source);
			return transaction.toEnvelope().toXDR('base64');
		} catch (err) {
			return '';
		}
	}

	private getMnemonic(keychain: string, password: string): string {
		try {
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
			return '';
		}
	}
}
