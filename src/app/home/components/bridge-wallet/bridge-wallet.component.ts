import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { IWalletExchange, IWalletState } from '../bridge-form/bridge-form.model';
import { PolygonService } from '@home/services/polygon/polygon.service';
import { GbmService } from '@home/services/gbm/gbm.service';
import { WalletBaseService } from '@home/services/wallet-base';

@Component({
	selector: 'br-bridge-wallet',
	templateUrl: './bridge-wallet.component.html',
	styleUrls: ['./bridge-wallet.component.less']
})
export class BridgeWalletComponent implements OnInit {
	@Output()
	public walletsToExchange: EventEmitter<IWalletExchange> = new EventEmitter<IWalletExchange>();

	public walletsState: IWalletState[] = [];

	constructor(
		private modalRef: NgbModal,
		private gbmService: GbmService,
		private polygonService: PolygonService,
		public walletBase: WalletBaseService
	) {}

	public ngOnInit(): void {
		this.gbmService.getWalletData().subscribe(() => {
			this.walletsState = WalletBaseService.state;
			this.walletsToExchange.emit({
				from: this.walletsState.find(item => item.from && item.selected) || null,
				to: this.walletsState.find(item => !item.from && item.selected) || null
			});
		});
	}

	public async chooseWallet(crypto: IWalletState): Promise<void> {
		if (crypto.isPrimary) {
			return;
		}

		this.polygonService
			.getWalletData()
			.pipe(take(1))
			.subscribe(() => {
				this.walletsState = WalletBaseService.state;
				this.walletsToExchange.emit({
					from: this.walletsState.find(item => item.from && item.selected) || null,
					to: this.walletsState.find(item => !item.from && item.selected) || null
				});
			});
	}
}
