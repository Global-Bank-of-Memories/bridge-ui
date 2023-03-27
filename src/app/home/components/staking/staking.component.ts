import { Component, OnInit } from '@angular/core';
import {WalletBaseService} from '@home/services/wallet-base';
import {IWalletState} from '@home/services/wallet.model';
import {Options} from '@angular-slider/ngx-slider';
import { ConcordiumService } from '@home/services/concordium/concordium.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StakingService} from '@home/services/concordium/staking.service';
import {IFundLevel} from '@home/services/concordium/fund-level.interface';

@Component({
	selector: 'br-staking',
	templateUrl: './staking.component.html',
	styleUrls: ['./staking.component.less']
})
export class StakingComponent implements OnInit {
	stakingForm: FormGroup;
	isLoading = true;
	isStaked = false;
	fundLevel: IFundLevel;
	minStakingPeriod = 90;
	maxStakingPeriod = 120;
	defaultStakingPeriod = this.maxStakingPeriod;
	sliderOptions: Options = {
		floor: this.minStakingPeriod,
		ceil: this.maxStakingPeriod,
		translate: (value: number): string => value + ' days',
	};

	constructor(
		private readonly walletBase: WalletBaseService,
		private readonly concordiumService: ConcordiumService,
		private readonly stakingService: StakingService,
		private fb: FormBuilder
	) {
	}

	public get wallet(): IWalletState {
		return WalletBaseService.state.find(wallet => wallet.id === 'cnc');
	}

	ngOnInit(): void {
		this.concordiumService.getWalletData().subscribe((data) => {
			this.fundLevel = data;
		});

		this.stakingService
			.getStakingLevel()
			.subscribe((data) => {
			  console.log(data);
		  });

		this.stakingService.getConcordiumProvider().then(() => {
			this.isLoading = false;
			this.initForm();
		});
	}

	stake(): void {
    console.log(this.stakingForm.value);
    console.log(this.stakingForm.invalid);
		if (this.stakingForm.invalid) {
			return;
		}
		this.stakingService.stake(
			this.stakingForm.value.amount,
			this.wallet.walletId).then((data) => {
			  console.log(data);
		});
	}
	private initForm(): void {
		this.stakingForm = this.fb.group({
			amount: [
				this.wallet?.balance || 0,
				[
					Validators.required,
					Validators.min(1)
				]
			],
			period: [this.defaultStakingPeriod, Validators.required]
		});
	}
}
