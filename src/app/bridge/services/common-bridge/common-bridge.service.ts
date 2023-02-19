import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import {
	IBridgeConstantsData,
	IBridgeConstantsResponse,
	IConcordiumConstantsData,
	IConcordiumConstantsResponse,
	IPolygonConstantsData,
	IPolygonConstantsResponse,
	IStellarConstantsData,
	IStellarConstantsResponse
} from './common-bridge.model';

@Injectable({
	providedIn: 'root'
})
export class CommonBridgeService {
	constructor(protected httpClient: HttpClient) {}

	public getBridgeConstants(): Observable<IBridgeConstantsData> {
		return this.httpClient.get<IBridgeConstantsResponse>(`${environment.gbmApiUrl}/bridge/consts/bridge`).pipe(
			filter(Boolean),
			map((res: IBridgeConstantsResponse) => res?.data),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	public getStellarConstants(): Observable<IStellarConstantsData> {
		return this.httpClient.get<IStellarConstantsResponse>(`${environment.gbmApiUrl}/bridge/consts/stellar`).pipe(
			filter(Boolean),
			map((res: IStellarConstantsResponse) => res?.data),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	public getPolygonConstants(): Observable<IPolygonConstantsData> {
		return this.httpClient.get<IPolygonConstantsResponse>(`${environment.gbmApiUrl}/bridge/consts/polygon`).pipe(
			filter(Boolean),
			map((res: IPolygonConstantsResponse) => res?.data),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	public getConcordiumConstants(): Observable<IConcordiumConstantsData> {
		return this.httpClient.get<IConcordiumConstantsResponse>(`${environment.gbmApiUrl}/bridge/consts/concordium`).pipe(
			filter(Boolean),
			map((res: IConcordiumConstantsResponse) => res?.data),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}
}
