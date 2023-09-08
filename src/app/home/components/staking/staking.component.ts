import { Component, OnInit } from '@angular/core';
import {LOGGER_TYPES, WalletBaseService} from '@home/services/wallet-base';
import {IWalletState} from '@home/services/wallet.model';
import {Options} from '@angular-slider/ngx-slider';
import { ConcordiumService } from '@home/services/concordium/concordium.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StakingService} from '@home/services/concordium/staking.service';
import {IFundLevel} from '@home/services/concordium/fund-level.interface';
import {filter} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
	selector: 'br-staking',
	templateUrl: './staking.component.html',
	styleUrls: ['./staking.component.less']
})
export class StakingComponent implements OnInit {
	stakingForm: FormGroup;
	isPeriod = false;
	isLoading = true;
	isInteracting = false;
	isStaked = false;
	stakedAmount: string;
	harvestableAmount: string;
	fundLevel: IFundLevel;
	minStakingPeriod = 90;
	maxStakingPeriod = 120;
	minStakingAmount = 5;
	poolStakedAmount: string;
	defaultStakingPeriod = this.maxStakingPeriod;
	canUnstakeIn = new Date(Date.now() + 0);
	isPossibleToUnstake = false;

	sliderOptions: Options = {
		floor: this.minStakingPeriod,
		ceil: this.maxStakingPeriod,
		translate: (value: number): string => value + ' days',
	};
	notification = {
		showNotification: false,
		notificationTextSuccess: 'You have successfully collected',
		notificationTextError: 'Something went wrong. Please try again!',
		notificationType: 'success',
		message: '',
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

	public ngOnInit(): void{
		this.concordiumService
			.getWalletData()
			.subscribe((data) => {
			  this.fundLevel = data;
				WalletBaseService.state = WalletBaseService.state.map(wallet => {
					if (wallet.id === 'cnc') {
						return {
							...wallet,
							connected: true
						};
					}
					return wallet;
				});

				this.getStakingInfo();
			});

		this.stakingService
			.getConcordiumProvider()
			.then((res) => {
				this.getStakingInfo();
			});

		this.concordiumService.walletConnected
			.pipe(
				filter(res => !!res)
			)
			.subscribe(() => {
				this.getStakingInfo();
			});

		this.initForm();
	}

	public stake(): void {
		if (this.isInteracting) {
			return;
		}
		if (this.stakingForm.invalid) {
			this.stakingForm.markAllAsTouched();
			return;
		}
		this.isInteracting = true;
		this.stakingService.stake(
			this.stakingForm.value.amount,
			this.wallet.walletId
		).then(() => {
			this.isInteracting = false;
			this.getStakingInfo();
		}).catch((error) => {
			this.isInteracting = false;
		});
	}

	public unstake(): void {
		if (this.isInteracting || !this.isPossibleToUnstake) {
			return;
		}
		this.isInteracting = true;
		this.stakingService.unstake(
			this.wallet.walletId
		).then((data) => {
			this.isInteracting = false;
			this.notification.showNotification = true;
			this.notification.notificationType = 'success';
			this.notification.message = this.notification.notificationTextSuccess;
			this.getStakingInfo();
		}).catch((error) => {
			this.isInteracting = false;
			this.notification.showNotification = true;
			this.notification.message = this.notification.notificationTextError;
			this.notification.notificationType = 'error';
		});
	}

	public resetNotification(): void {
		this.notification.showNotification = false;
		this.notification.message = '';
	}

	public onTimerFinished(res: boolean): void {
		this.isPossibleToUnstake = res;
	}

	public harvestRewards(): void {
		this.isInteracting = true;
		this.stakingService.harvestRewards(
			this.wallet.walletId
		).then((data) => {
			this.isInteracting = false;
		});
	}

	public onRequestAssets(): void {
		this.concordiumService
			.requestAssets(this.wallet.walletId)
			.then(res => {
				if (res && res.success && !_.isEmpty(res.result)) {
					WalletBaseService.logger(`Assets request for ${this.wallet.walletId} succeeded`, LOGGER_TYPES.SUCCESS);
				} else {
					WalletBaseService.logger(`Requesting assets for ${this.wallet.walletId} failed`, LOGGER_TYPES.ERROR);
				}

				return;
			})
			.catch(() => {
				WalletBaseService.logger(`Requesting assets for ${this.wallet.title} failed`, LOGGER_TYPES.ERROR);
			});

	}

	private getStakingInfo(): void {
		if (!this.wallet.walletId) {
			return;
		}
		this.stakingService.getPoolStaking(this.wallet.walletId).then(
			(data) => {
				this.resetNotification();
				if (data?.user_staked_amount <= 0) {
					this.isStaked = false;
					this.isLoading = false;
					return;
				}
				this.isStaked = true;
				this.isLoading = false;
				this.stakedAmount = (data.user_staked_amount / 10000000).toFixed(7);
				this.harvestableAmount = (data.user_harvestable_rewards / 10000000).toFixed(7);
				this.poolStakedAmount = (data.pool_staked_amount / 10000000).toFixed(7);
				this.canUnstakeIn = new Date(data.staked_time +  data.min_blocks_unstake * data.block_duration);
		  },
			(err) => {
				this.isLoading = false;
			}
		);
	}

	private initForm(): void {
		this.stakingForm = this.fb.group({
			amount: [
				this.wallet?.balance || 0,
				[
					Validators.required,
					Validators.min(this.minStakingAmount),
				]
			],
			period: [this.defaultStakingPeriod]
		});
	}
}
