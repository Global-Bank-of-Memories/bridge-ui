import { AuthService } from '../services/auth/auth.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {}

	/**
	 * @description verifying token integrity and expiration term
	 * @returns boolean
	 */
	public canActivate(): boolean {
		if (!this.authService.isAuthenticated()) {
			void this.router.navigate(['/auth']);
			return false;
		}

		return true;
	}
}
