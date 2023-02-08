import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AccessTokenData, ACCESS_TOKEN_STORAGE_KEY } from './auth.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) {}

	public login(username: string, password: string): any {
		try {
			const loginResponse = {
				access_token: ''
			}; // Auth request
			if (loginResponse) {
				localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, loginResponse.access_token);
				void this.router.navigate(['/']);
				return loginResponse;
			}

			return null;
		} catch (err) {
			console.error('Authentication Error: ', err);
			return err;
		}
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
