import { FormControl } from '@angular/forms';
import { GenericFormGroup } from '@shared/components/generic-form-base/generic-form-base-model';

export interface ISubmitState {
	title: SubmitState;
	loading: boolean;
}

export enum SubmitState {
	SEND_TRANSFER = 'Send Transfer',
	SIGN = 'Sign',
	WITHDRAW = 'Withdraw',
	REFUND = 'Refund'
}

export interface BridgeBasicFormControls {
	from: string;
	to: string;
}

export const BRIDGE_BASIC_FORM_CONTROLS: BridgeBasicFormControls = {
	from: '0.0000001',
	to: '0.0000001'
};

export type BridgeFormModel = BridgeBasicFormControls;

export type BridgeFormControls = {
	[key in keyof BridgeFormModel]: FormControl;
};

export type BridgeFormGroup = GenericFormGroup<BridgeBasicFormControls, BridgeFormModel>;
