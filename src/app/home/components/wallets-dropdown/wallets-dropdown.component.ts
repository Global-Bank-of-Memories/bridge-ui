import {
	Component,
	ChangeDetectionStrategy,
	Input,
	ViewChild,
	Output,
	EventEmitter,
	ElementRef,
	ChangeDetectorRef,
	OnInit,
	HostListener
} from '@angular/core';
import { ConcordiumService } from '@home/services/concordium/concordium.service';
import { PolygonService } from '@home/services/polygon/polygon.service';
import { SubmitState, WalletBaseService } from '@home/services/wallet-base';
import { IWalletState } from '@home/services/wallet.model';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

@Component({
	selector: 'br-wallets-dropdown',
	templateUrl: './wallets-dropdown.component.html',
	styleUrls: ['./wallets-dropdown.component.less'],
	animations: [FADE_ANIMATION],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletsDropdownComponent {
	@Input()
	public data: IWalletState[] = [];

	@Input()
	public settings: any;

	@ViewChild('dropdownInput')
	public dropdownInput!: ElementRef;

	public show = false;
	public disabled = false;

	constructor(private polygonService: PolygonService, private concordium: ConcordiumService) {}

	public get isDefaultSubmitState(): boolean {
		return WalletBaseService.submitState === SubmitState.SEND_TRANSFER && !WalletBaseService.loading;
	}

	public get selectedWallet(): IWalletState | null {
		return WalletBaseService.state.find(wallet => wallet.id !== 'gbm' && wallet.selected) || null;
	}

	@HostListener('document:click', ['$event'])
	public onClick(targetElementPath: PointerEvent): void {
		if (targetElementPath) {
			if (!this.dropdownInput.nativeElement.contains(targetElementPath.target)) {
				this.show = false;
			}
		}
	}

	public openDropdown(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		if (this.isDefaultSubmitState) {
			this.show = !this.show;
		}
	}

	public async connectWallet(walletItem: IWalletState): Promise<void> {
		if (!walletItem.isPrimary && this.isDefaultSubmitState) {
			if (walletItem.id === 'cnc') {
				this.concordium
					.getWalletData()
					.pipe(take(1))
					.subscribe(() => {
						WalletBaseService.state = WalletBaseService.state.map(wallet => {
							if (wallet.id === walletItem.id) {
								return {
									...wallet,
									connected: true
								};
							}

							return wallet;
						});
					});

				return;
			}

			this.polygonService
				.getWalletData()
				.pipe(take(1))
				.subscribe(() => {
					WalletBaseService.state = WalletBaseService.state.map(wallet => {
						if (wallet.id === walletItem.id) {
							return {
								...wallet,
								connected: true
							};
						}

						return wallet;
					});
				});
		}
	}

	public chooseWallet(selectedWallet: any): void {
		if (this.isDefaultSubmitState) {
			const gbmAcc = WalletBaseService.state.find(item => item.id === 'gbm');
			WalletBaseService.state = WalletBaseService.state.map(wallet => {
				if (selectedWallet.id !== wallet.id && wallet.selected && !wallet.isPrimary) {
					return {
						...wallet,
						selected: false,
						from: !gbmAcc.from ? true : false
					};
				}

				if (selectedWallet.id === wallet.id) {
					return {
						...wallet,
						selected: true,
						from: !gbmAcc.from ? true : false
					};
				}

				return wallet;
			});
			this.show = !this.show;
		}
	}
}
