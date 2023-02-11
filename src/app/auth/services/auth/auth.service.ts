import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccessTokenData, ACCESS_TOKEN_STORAGE_KEY, LoginResponse } from './auth.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import sha1 from 'sha1';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

	public login(email: string, password: string): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>('https://api.bankofmemories.org/bridge/login', { email, password: sha1(password) })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
		// try {
		// 	const loginResponse = {
		// 		access_token: ''
		// 	}; // Auth request
		// 	if (loginResponse) {
		// 		localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, loginResponse.access_token);
		// 		void this.router.navigate(['/']);
		// 		return loginResponse;
		// 	}
	}

	public checkOTP(code: string, token: string): Observable<any> {
		return this.http
			.post<any>('https://api.bankofmemories.org/bridge/otp-check', { code, token })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
	}

	public retryOTP(token: string): Observable<any> {
		return this.http
			.post<any>('https://api.bankofmemories.org/bridge/otp-retry', { token })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
	}

	public isAuthenticated(): boolean {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '';
		if (accessToken) {
			const decodedToken = this.jwtHelper.decodeToken(accessToken);
			return !this.jwtHelper.isTokenExpired(accessToken) && !!decodedToken;
		}

		return false;
	}

	public getUserData(): AccessTokenData | null {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '';
		return accessToken ? this.jwtHelper.decodeToken(accessToken) : null;
	}
}
