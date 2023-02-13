import { Component } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { IWalletExchange } from './components/bridge-form/bridge-form.model';

@Component({
	selector: 'br-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [FADE_ANIMATION]
})
export class HomeComponent {
	public walletsToExchange!: IWalletExchange;

	constructor(public authService: AuthService) {}

	public onWalletsToExchange(wallets: IWalletExchange): void {
		this.walletsToExchange = wallets;
	}
}
