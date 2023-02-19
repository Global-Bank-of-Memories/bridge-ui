import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export abstract class GbmBridgeBase {
	constructor(protected httpClient: HttpClient) {}

	public getKeychain(): Observable<string> {
		return this.httpClient.get(`${environment.gbmApiUrl}/bridge/keychain`).pipe(
			filter(Boolean),
			map(res => _.get(res, 'keychain', '')),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	protected abstract getMnemonic(): Observable<any>;
	protected abstract sign(): Observable<any>;
}
