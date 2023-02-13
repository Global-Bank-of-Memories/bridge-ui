import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ToastService } from '@shared/components/toast/toast.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WalletBaseService } from '../wallet-base';

@Injectable({
	providedIn: 'root'
})
export class GbmService extends WalletBaseService {
	constructor(protected toastService: ToastService, protected httpClient: HttpClient) {
		super(toastService, httpClient);
	}

	public getWalletData(): Observable<any> {
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

	protected getBalance(): any {}
	protected getWallet(): any {}
}
