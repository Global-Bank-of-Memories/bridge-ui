import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { BridgeBase } from '../bridge-base';
import { BridgeDataService } from '../bridge-data.service';

@Injectable({
	providedIn: 'root'
})
export class ConcordiumService extends BridgeBase {
	constructor(protected httpClient: HttpClient, protected bridgeDataService: BridgeDataService) {
		super(httpClient, bridgeDataService);
	}

	public getAccount(): Observable<any> {
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/wallet`).pipe(
			filter(Boolean),
			map((res: any) => ({
				walletId: res?.wallet?.public_key || '',
				balance: res?.wallet?.balance || '',
				connected: true
			})),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	protected getBalance(): void {}
	protected getWallet(): void {}
	protected deposit(): void {}
	protected withdraw(): void {}
}
