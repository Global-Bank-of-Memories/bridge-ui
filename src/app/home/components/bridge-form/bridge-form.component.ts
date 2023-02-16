/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable brace-style */
import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import {
	BridgeBasicFormControls,
	BridgeFormControls,
	BridgeFormGroup,
	BridgeFormModel,
	BRIDGE_BASIC_FORM_CONTROLS,
	IWalletState
} from './bridge-form.model';
import { PolygonService, validatorUrls } from '@home/services/polygon/polygon.service';
import { BridgeService } from '@home/services/bridge/bridge.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { GbmService } from '@home/services/gbm/gbm.service';
import * as _ from 'lodash';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '@home/services/wallet-base';
import { LoggerDictionary } from '../logger/logger.dictionary';

@Component({
	selector: 'br-bridge-form',
	templateUrl: './bridge-form.component.html',
	styleUrls: ['./bridge-form.component.less'],
	animations: [FADE_ANIMATION]
})
export class BridgeFormComponent
	extends GenericFormBaseComponent<BridgeFormControls, BridgeFormModel>
	implements OnInit, OnChanges
{
	public xdr = '';
	public validationMessage = '';
	public transactionHash = '';
	public withdrawEthereumResponse!: any;
	public formGroup!: BridgeFormGroup;
	public switchDisabled = false;
	public serviceForTransactions!: any;

	constructor(
		formBuilder: FormBuilder,
		private bridgeService: BridgeService,
		private polygonService: PolygonService,
		private gbmService: GbmService,
		private injector: Injector
	) {
		super(formBuilder);
	}

	public get walletFrom(): IWalletState | null {
		return WalletBaseService.state.find(wallet => wallet.from && wallet.selected) || null;
	}

	public get walletTo(): IWalletState | null {
		return WalletBaseService.state.find(wallet => !wallet.from && wallet.selected) || null;
	}

	public get submitState(): SubmitState {
		return WalletBaseService.submitState;
	}

	public get loading(): boolean {
		return WalletBaseService.loading;
	}

	public get logs(): string {
		return WalletBaseService.logs;
	}

	public get from(): FormControl {
		return this.formGroup.controls.from;
	}

	public get to(): FormControl {
		return this.formGroup.controls.to;
	}

	public ngOnInit(): void {
		this.serviceForTransactions = this.injector.get(GbmService);
		WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
		this.initForm();
		this.setValidators();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.walletTo && this.walletTo?.walletId.length > 3) {
			WalletBaseService.logger(`${this.walletTo?.title} ${LoggerDictionary.WALLETS_CONNECTED}`, LOGGER_TYPES.SUCCESS);
		}
	}

	public onSwitch(): void {
		if (this.walletTo && this.walletTo?.walletId.length < 3) {
			WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
			return;
		}

		WalletBaseService.state = WalletBaseService.state.map(wallet => {
			if (wallet.walletId === this.walletTo?.walletId) {
				return {
					...wallet,
					from: true
				};
			}

			if (wallet.walletId === this.walletFrom?.walletId) {
				return {
					...wallet,
					from: false
				};
			}

			return wallet;
		});

		WalletBaseService.logger(
			`${LoggerDictionary.WALLETS_SWITCHED} ${this.walletFrom?.title} > ${this.walletTo?.title}`
		);
	}

	public onSubmit(): void {
		if (WalletBaseService.submitState === SubmitState.SEND_TRANSFER) {
			this.switchDisabled = true;
			this.sendTransfer();
			return;
		}

		if (WalletBaseService.submitState === SubmitState.SIGN) {
			this.switchDisabled = true;
			this.sign();
			return;
		}

		if (WalletBaseService.submitState === SubmitState.WITHDRAW) {
			this.switchDisabled = false;
			this.withdraw();
			return;
		}
	}

	public withdraw(): void {
		this.gbmService.handleWithdraw(this.transactionHash, this.walletTo?.walletId || '');
	}

	public sendTransfer(): void {
		const { from, to } = this.formGroup.controls;
		if (from.value <= 0) {
			WalletBaseService.logger(LoggerDictionary.INVALID_INPUT_VALUE, LOGGER_TYPES.ERROR);
			return;
		}

		if (parseFloat(_.get(this.walletFrom, 'balance', 0).toString()) <= 0) {
			WalletBaseService.logger(LoggerDictionary.NOT_ENOUGH_BALANCE, LOGGER_TYPES.ERROR);
			return;
		}

		if (this.walletTo && this.walletTo?.walletId.length < 3) {
			WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
			return;
		}

		WalletBaseService.loading = true;
		WalletBaseService.logger(`${LoggerDictionary.SENDING_TRANSFER_FROM} ${this.walletFrom?.title}`);
		this.formGroup.addControl('password', new FormControl('', Validators.required));
		this.gbmService.sendTransfer(from.value).subscribe(xdr => {
			this.xdr = xdr;
			WalletBaseService.logger(LoggerDictionary.TRANSFERING_COMPLETED);
			WalletBaseService.logger(LoggerDictionary.RE_ENTER_PASSWORD, LOGGER_TYPES.WARNING);
			WalletBaseService.loading = false;
			WalletBaseService.submitState = SubmitState.SIGN;
		});
	}

	public sign(): void {
		WalletBaseService.loading = true;
		const pass = this.formGroup.get('password');
		this.gbmService.sign(pass?.value).subscribe(
			res => {
				this.transactionHash = res;
				this.xdr = '';
				WalletBaseService.loading = false;
				WalletBaseService.submitState = SubmitState.WITHDRAW;
				WalletBaseService.logger(LoggerDictionary.TRANSACTION_SIGNED, LOGGER_TYPES.SUCCESS);
			},
			err => {
				WalletBaseService.loading = false;
			}
		);
	}

	private setValidators(): void {
		const { from, to } = this.formGroup.controls;

		from.addValidators([Validators.required, Validators.maxLength(9)]);
		to.addValidators([Validators.required, Validators.maxLength(9)]);
	}

	private initForm(): void {
		this.setFormControls<BridgeBasicFormControls>({
			basicFormControls: BRIDGE_BASIC_FORM_CONTROLS
		});

		this.formGroup = this.getFormForModule();
		const { from, to } = this.formGroup.controls;
		from.valueChanges.subscribe(value => {
			to.patchValue(value);
			to.markAsTouched();
			this.validationMessage = '';
		});
	}
}
