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
import { PolygonService } from '@home/services/polygon/polygon.service';
import { WalletBaseService } from '@home/services/wallet-base';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { IWalletState } from '../bridge-form/bridge-form.model';

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

	constructor(private polygonService: PolygonService) {}

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

		this.show = !this.show;
	}

	public async connectWallet(walletItem: IWalletState): Promise<void> {
		if (walletItem.isPrimary) {
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

	public chooseWallet(selectedWallet: any): void {
		WalletBaseService.state = WalletBaseService.state.map(wallet => {
			if (selectedWallet.id !== wallet.id && wallet.selected && !wallet.isPrimary) {
				return {
					...wallet,
					selected: false
				};
			}

			if (selectedWallet.id === wallet.id) {
				return {
					...wallet,
					selected: true
				};
			}

			return wallet;
		});
		console.log(WalletBaseService.state);
		this.show = !this.show;
	}
}