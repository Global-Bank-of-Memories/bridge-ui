import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { SubmitState, WalletBaseService } from './services/wallet-base';

@Component({
	selector: 'br-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [FADE_ANIMATION]
})
export class HomeComponent implements OnInit {
	public loading = false;

	constructor(public authService: AuthService) {}

	public ngOnInit(): void {
		this.loading = true;
		setTimeout(() => this.loading = false, 1000);
	}

	public get emptyState(): boolean {
		return WalletBaseService.emptyState;
	}

	public async logOut(): Promise<void> {
		if (!this.isDefaultSubmitState) {
			return;
		}

		return this.authService.logOut().toPromise();
	}

	public get isDefaultSubmitState(): boolean {
		return WalletBaseService.submitState === SubmitState.SEND_TRANSFER && !WalletBaseService.loading;
	}
}
