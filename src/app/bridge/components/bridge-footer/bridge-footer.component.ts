import { Component, Input } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { ILog } from '../bridge-logger/bridge-logger.model';
import { MAILTO } from './bridge-footer.model';

@Component({
	selector: 'br-bridge-footer',
	templateUrl: './bridge-footer.component.html',
	styleUrls: ['./bridge-footer.component.less']
})
export class BridgeFooterComponent {
	@Input()
	public log!: ILog;

	public mailto = '';

	constructor(public authService: AuthService) {}

	public async logOut(): Promise<void> {
		return this.authService.logOut().toPromise();
	}

	public mailTo(element: HTMLAnchorElement): void {
		this.mailto = MAILTO;
		element.href = this.mailto;
	}
}
