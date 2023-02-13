import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BridgeService {
	constructor(private httpClient: HttpClient) {}

	public getAccount(id: string): Observable<any> {
		return this.httpClient.get(`${environment.bridge}/accounts/${id}`);
	}

	public getFee(): Observable<any> {
		return this.httpClient.get(`${environment.bridge}/fee_stats`);
	}
}
