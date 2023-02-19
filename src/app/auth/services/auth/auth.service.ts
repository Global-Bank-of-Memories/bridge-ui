import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccessTokenData, ACCESS_TOKEN_STORAGE_KEY, LoginResponse, OTPResponse, OTPRetryResponse } from './auth.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import sha1 from 'sha1';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {}

	public login(email: string, password: string): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>('https://api.bankofmemories.org/bridge/login', { email, password: sha1(password) })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
	}

	public logOut(): Observable<any> {
		return this.http.post<any>('https://api.bankofmemories.org/bridge/logout', null).pipe(
			tap(() => {
				localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, '');
				void this.router.navigate(['/auth']);
			}),
			catchError((err: HttpErrorResponse) => throwError(err))
		);
	}

	public checkOTP(code: string, token: string): Observable<OTPResponse> {
		return this.http
			.post<OTPResponse>('https://api.bankofmemories.org/bridge/otp-check', { code, token })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
	}

	public retryOTP(token: string): Observable<OTPRetryResponse> {
		return this.http
			.post<OTPRetryResponse>('https://api.bankofmemories.org/bridge/otp-retry', { token })
			.pipe(catchError((err: HttpErrorResponse) => throwError(err)));
	}

	public setAccessToken(otpResponse: OTPResponse): void {
		const { access_token } = otpResponse.data;

		localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
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
