import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { IWalletState, WalletsState } from './wallet.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { Observable } from 'rxjs';

export enum SubmitState {
	SEND_TRANSFER = 'Send Transfer',
	SIGN = 'Sign',
	WITHDRAW = 'Withdraw'
}

export const LOGS_THRESHOLD = 10000;

export enum LOGGER_TYPES {
	DEFAULT = 'default',
	WARNING = 'warning',
	ERROR = 'error',
	SUCCESS = 'success',
	INFO = 'info'
}

@Injectable({
	providedIn: 'root'
})
export abstract class WalletBaseService {
	public static state = WalletsState;
	public static logs = '';
	public static xdr = '';
	public static emptyState = false;
	public static loading = false;
	public static submitState = SubmitState.SEND_TRANSFER;

	constructor(protected toastService: ToastService, protected httpClient: HttpClient) {
  }

	protected abstract getWallet(): Observable<any>;
	protected abstract getBalance(wallet: any): Observable<string>;

	public static updateWalletState(walletStateId: string, updates: Partial<IWalletState>): void {
		WalletBaseService.state = WalletBaseService.state.map(wallet =>
			wallet.id === walletStateId ? { ...wallet, ...updates } : wallet
		);
	}

	public static logger(message: string, type: LOGGER_TYPES = LOGGER_TYPES.DEFAULT): void {
		if (WalletBaseService.logs.length > LOGS_THRESHOLD) {
			WalletBaseService.logs = '';
		}

		let cssClass = 'log-default';
		if (type === LOGGER_TYPES.WARNING) {
			cssClass = 'log-warning';
		} else if (type === LOGGER_TYPES.ERROR) {
			cssClass = 'log-error';
		} else if (type === LOGGER_TYPES.SUCCESS) {
			cssClass = 'log-success';
		} else if (type === LOGGER_TYPES.INFO) {
			cssClass = 'log-info';
		}

		this.logs += `<p class="${cssClass}">> ${new Date().toLocaleTimeString()}: ${message}</p>`;

		const loggerContainer = document.querySelector('#logger-container');

		if (loggerContainer) {
			setTimeout(() => loggerContainer.scroll({ behavior: 'smooth', top: loggerContainer.scrollHeight }));
		}
	}
}
