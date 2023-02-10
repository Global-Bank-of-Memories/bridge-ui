import { FormControl } from '@angular/forms';
import { GenericFormGroup } from '@shared/components/generic-form-base/generic-form-base-model';

export interface LoginBasicFormControls {
	email: string;
	password: string;
}

export const BASIC_FORM_CONTROLS: LoginBasicFormControls = {
	email: '',
	password: ''
};

export type LoginFormModel = LoginBasicFormControls;

export type LoginFormControls = {
	[key in keyof LoginFormModel]: FormControl;
};

export type LoginFormGroup = GenericFormGroup<LoginBasicFormControls, LoginFormModel>;
