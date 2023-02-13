import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IWalletState, WalletsState } from '@home/components/bridge-form/bridge-form.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export abstract class WalletBaseService {
	public static state = WalletsState;

	constructor(protected toastService: ToastService, protected httpClient: HttpClient) {}

	protected abstract getWallet(): Observable<any>;
	protected abstract getBalance(wallet: any): Observable<string>;

	public static updateWalletState(walletStateId: string, updates: Partial<IWalletState>): void {
		WalletBaseService.state = WalletBaseService.state.map(wallet =>
			wallet.id === walletStateId ? { ...wallet, ...updates } : wallet
		);
	}
}
