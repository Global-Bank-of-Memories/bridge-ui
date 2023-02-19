import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { AccountIDs } from '@bridge/enums/account.enum';
import { IAccount } from '@bridge/interfaces/account.interfaces';
import { BridgeDataService } from '@bridge/services/bridge-data.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'br-bridge-accounts',
	templateUrl: './bridge-accounts.component.html',
	styleUrls: ['./bridge-accounts.component.less'],
	animations: [FADE_ANIMATION],
	changeDetection: ChangeDetectionStrategy.Default
})
export class BridgeAccountsComponent implements OnInit, OnDestroy {
	@Input()
	public set accounts(accounts: IAccount[]) {
		this.primaryAccount = accounts.find(account => account.id === AccountIDs.GBM);
		this.selectedAccount = accounts.find(account => account.id !== AccountIDs.GBM && account.selected);
	}

	@Input()
	public disabled = false;

	@Input()
	public connectionLoading = false;

	@Output()
	public selectAccount: EventEmitter<IAccount> = new EventEmitter<IAccount>();

	@Output()
	public accountConnection: EventEmitter<IAccount> = new EventEmitter<IAccount>();

	@ViewChild('accountsDropdown')
	public accountsDropdown!: ElementRef;

	public show = false;
	public dropdownAccounts: IAccount[] = [];
	public primaryAccount!: IAccount;
	public selectedAccount!: IAccount;

	public destroy$: Subject<void> = new Subject();

	constructor(public bridgeDataService: BridgeDataService) {}

	@HostListener('document:click', ['$event'])
	public onClick(targetElementPath: PointerEvent): void {
		if (targetElementPath) {
			if (!this.accountsDropdown.nativeElement.contains(targetElementPath.target)) {
				this.show = false;
			}
		}
	}

	public ngOnInit(): void {
		this.bridgeDataService.primaryAccount$
			.pipe(takeUntil(this.destroy$))
			.subscribe(account => (this.primaryAccount = account));

		this.bridgeDataService.selectedAccount$
			.pipe(takeUntil(this.destroy$))
			.subscribe(account => (this.selectedAccount = account));
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public toggleDropdown(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		this.show = !this.show;
	}

	public onSelectAccount(account: IAccount): void {
		this.bridgeDataService.selectAccount(account);
	}

	public onAccountConnection(account: IAccount): void {
		this.bridgeDataService.setAccountConnectionLoading(true);
		this.bridgeDataService.setAccountData(account.id);
	}
}
