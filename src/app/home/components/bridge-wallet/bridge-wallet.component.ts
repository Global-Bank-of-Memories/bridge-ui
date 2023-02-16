import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { IWalletExchange, IWalletState } from '../bridge-form/bridge-form.model';
import { PolygonService } from '@home/services/polygon/polygon.service';
import { GbmService } from '@home/services/gbm/gbm.service';
import { LOGGER_TYPES, WalletBaseService } from '@home/services/wallet-base';
import { LoggerDictionary } from '../logger/logger.dictionary';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';

@Component({
	selector: 'br-bridge-wallet',
	templateUrl: './bridge-wallet.component.html',
	styleUrls: ['./bridge-wallet.component.less'],
	animations: [FADE_ANIMATION]
})
export class BridgeWalletComponent implements OnInit {
	constructor(
		private modalRef: NgbModal,
		private gbmService: GbmService,
		private polygonService: PolygonService,
		public walletBase: WalletBaseService
	) {}

	public get gbmWallet(): IWalletState | null {
		return WalletBaseService.state.find(wallet => wallet.id === 'gbm') || null;
	}

	public get wallets(): IWalletState[] {
		return WalletBaseService.state.filter(wallet => wallet.id !== 'gbm');
	}

	public ngOnInit(): void {
		this.gbmService.getWalletData().subscribe(() => {
			WalletBaseService.logger(LoggerDictionary.WALLET_CONNECTED_SUCCESSFULLY, LOGGER_TYPES.SUCCESS);
		});
	}
}
