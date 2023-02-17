import { Component } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { WalletBaseService } from './services/wallet-base';

@Component({
	selector: 'br-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [FADE_ANIMATION]
})
export class HomeComponent {
	constructor(public authService: AuthService) {}

	public get emptyState(): boolean {
		return WalletBaseService.emptyState;
	}
}
