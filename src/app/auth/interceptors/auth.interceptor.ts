import { ACCESS_TOKEN_STORAGE_KEY } from '@auth/services/auth/auth.model';
import { AuthService } from '../services/auth/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	/**
	 * @description adding authorization header with current access_token
	 * @returns HttpEvent
	 */
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const isAuthenticated = this.authService.isAuthenticated();
		const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '';

		if (isAuthenticated && accessToken) {
			request = request.clone({
				setHeaders: { Authorization: `Bearer ${accessToken}` }
			});
		}

		return next.handle(request);
	}
}
