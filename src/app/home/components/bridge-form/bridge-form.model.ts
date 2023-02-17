import { FormControl } from '@angular/forms';
import { GenericFormGroup } from '@shared/components/generic-form-base/generic-form-base-model';

export interface BridgeBasicFormControls {
	from: number;
	to: number;
	password: string;
}

export const BRIDGE_BASIC_FORM_CONTROLS: BridgeBasicFormControls = {
	from: 0.0000001,
	to: 0.0000001,
	password: ''
};

export type BridgeFormModel = BridgeBasicFormControls;

export type BridgeFormControls = {
	[key in keyof BridgeFormModel]: FormControl;
};

export type BridgeFormGroup = GenericFormGroup<BridgeBasicFormControls, BridgeFormModel>;
