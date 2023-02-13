/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable brace-style */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import {
	BridgeBasicFormControls,
	BridgeFormControls,
	BridgeFormGroup,
	BridgeFormModel,
	BRIDGE_BASIC_FORM_CONTROLS,
	IWalletExchange
} from './bridge-form.model';
import { PolygonService } from '@home/services/polygon/polygon.service';
import { BridgeService } from '@home/services/bridge/bridge.service';

@Component({
	selector: 'br-bridge-form',
	templateUrl: './bridge-form.component.html',
	styleUrls: ['./bridge-form.component.less']
})
export class BridgeFormComponent
	extends GenericFormBaseComponent<BridgeFormControls, BridgeFormModel>
	implements OnInit
{
	@Input()
	public walletsToExchange!: IWalletExchange;

	public loading = false;
	public validationMessage = '';
	public formGroup!: BridgeFormGroup;

	constructor(formBuilder: FormBuilder, private bridgeService: BridgeService, private polygonService: PolygonService) {
		super(formBuilder);
	}

	public get from(): FormControl {
		return this.formGroup.controls.from;
	}

	public get to(): FormControl {
		return this.formGroup.controls.to;
	}

	public ngOnInit(): void {
		this.initForm();
		this.setValidators();
	}

	public onSwitch(): void {
		this.walletsToExchange = {
			from: this.walletsToExchange.to,
			to: this.walletsToExchange.from
		};
	}

	public async sendTransfer(): Promise<void> {
		const { from, to } = this.formGroup.controls;

		await this.polygonService.sendTransfer(from.value, to.value);
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

		this.formGroup.valueChanges.subscribe(() => {
			this.validationMessage = '';
		});
	}
}
