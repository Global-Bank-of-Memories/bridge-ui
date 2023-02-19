import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from './services/wallet-base';

@Component({
	selector: 'br-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [FADE_ANIMATION]
})
export class HomeComponent implements OnInit {
	public loading = false;
	public easterEgg = false;
	public counter1 = 0;
	public counter2 = 0;

	constructor(public authService: AuthService) {}

	public ngOnInit(): void {
		this.loading = true;
		setTimeout(() => (this.loading = false), 1000);
	}

	public get emptyState(): boolean {
		return WalletBaseService.emptyState;
	}

	public onEasterEgg(): void {
		this.counter1++;

		if (this.counter1 === 5) {
			WalletBaseService.logger('Анрей Заблокирован (DEV EASTER EGG)', LOGGER_TYPES.ERROR);
			this.counter1 = 0;
		}
	}

	public onEasterEgg2(): void {
		this.counter2++;

		if (this.counter2 === 5) {
			this.easterEgg = !this.easterEgg;
		}
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
