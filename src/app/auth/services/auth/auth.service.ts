import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AccessTokenData, ACCESS_TOKEN_STORAGE_KEY, ErrorResponse, LoginResponse } from './auth.model';
import sha1 from 'sha1';
import { catchError, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpModalComponent } from '@auth/components/otp-modal/otp-modal.component';
import { Observable, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(
		private router: Router,
		private http: HttpClient,
		private jwtHelper: JwtHelperService,
		private modalService: NgbModal
	) {}

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
