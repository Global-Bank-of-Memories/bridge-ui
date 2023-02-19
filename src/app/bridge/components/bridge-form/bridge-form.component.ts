/* eslint-disable brace-style */
/* eslint-disable prettier/prettier */
import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Accounts } from '@bridge/constants/account.constants';
import { AccountIDs } from '@bridge/enums/account.enum';
import { IAccount } from '@bridge/interfaces/account.interfaces';
import { BridgeDataService } from '@bridge/services/bridge-data.service';
import { GbmService } from '@bridge/services/gbm/gbm.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import { forkJoin, Subject } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';
import { ILog } from '../bridge-logger/bridge-logger.model';
import {
	BridgeBasicFormControls,
	BridgeFormControls,
	BridgeFormGroup,
	BridgeFormModel,
	BRIDGE_BASIC_FORM_CONTROLS,
	ISubmitState,
	SubmitState
} from './bridge-form.model';

@Component({
	selector: 'br-bridge-form',
	templateUrl: './bridge-form.component.html',
	styleUrls: ['./bridge-form.component.less'],
	animations: [FADE_ANIMATION]
})
export class BridgeFormComponent
	extends GenericFormBaseComponent<BridgeFormControls, BridgeFormModel>
	implements OnInit, OnDestroy
{
	@Output()
	public updateLog: EventEmitter<ILog> = new EventEmitter<ILog>();

	public loading = false;
	public disabled = false;
	public submitState!: ISubmitState;
	public password: string;
	public walletFrom = Accounts[0];
	public walletTo = Accounts[1];
	public formGroup!: BridgeFormGroup;
	public primaryAccount!: IAccount;
	public selectedAccount!: IAccount;

	public destroy$: Subject<void> = new Subject();

	public log: ILog = {
		id: `${AccountIDs.GBM}_${AccountIDs.POLYGON}`,
		data: '',
		createdDate: new Date(),
		updatedDate: new Date()
	};

	constructor(
		formBuilder: FormBuilder,
		private decimalPipe: DecimalPipe,
		public bridgeDataService: BridgeDataService,
		private gbmService: GbmService
	) {
		super(formBuilder);
	}

	public ngOnInit(): void {
		this.bridgeDataService.primaryAccount$
			.pipe(takeUntil(this.destroy$))
			.subscribe(account => (this.primaryAccount = account));

		this.bridgeDataService.selectedAccount$
			.pipe(takeUntil(this.destroy$))
			.subscribe(account => (this.selectedAccount = account));

		this.bridgeDataService.submitState$
			.pipe(takeUntil(this.destroy$))
			.subscribe(submitState => (this.submitState = submitState));

		this.initForm();
		this.setValidators();
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public onPasswordChange(event: string): void {
		this.password = event;
	}

	public async onSubmit(): Promise<void> {
		const { from, to } = this.formGroup.controls;

		await this.gbmService.gbmFlow(this.submitState, from.value, this.password);
		this.password = '';
	}

	public onSwitch(): void {
		this.bridgeDataService.switchAccounts();
	}

	public onRequestAssets(): void {
		console.log('Request Assets');
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
			to.patchValue(Number(this.transformValue(value)).toFixed(7).toString(), { emitEvent: false });
			to.markAsTouched();
		});

		to.valueChanges.subscribe(value => {
			from.patchValue(Number(this.transformValue(value)).toFixed(7).toString(), { emitEvent: false });
			from.markAsTouched();
		});
	}

	private transformValue(value: number): number {
		return value ? Number(this.decimalPipe.transform(value, '1.0-7').toString().split(',').join('')) : 0;
	}
}
