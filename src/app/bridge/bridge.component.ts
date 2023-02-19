import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { ILog } from './components/bridge-logger/bridge-logger.model';
import { Accounts } from './constants/account.constants';
import { IAccount } from './interfaces/account.interfaces';
import { BridgeDataService } from './services/bridge-data.service';

@Component({
	selector: 'br-bridge',
	templateUrl: './bridge.component.html',
	styleUrls: ['./bridge.component.less'],
	animations: [FADE_ANIMATION]
})
export class BridgeComponent implements OnInit {
	public accounts = Accounts;
	public log!: ILog;

	constructor(private bridgeDataService: BridgeDataService) {}

	public ngOnInit(): void {
		this.bridgeDataService.initModule();
	}

	public onUpdateLog(log: ILog): void {
		this.log = log;
	}

	public onSelectAccount(account: IAccount): void {
		console.log('Account Selected: ', account);
	}

	public onAccountConnection(account: IAccount): void {
		console.log('Account Connected/Disconnected: ', account);
	}
}
