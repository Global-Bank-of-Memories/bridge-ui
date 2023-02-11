import { FormControl } from '@angular/forms';
import { GenericFormGroup } from '@shared/components/generic-form-base/generic-form-base-model';

export enum LoginMessagesEnum {
	APP_CREDENTIALS = 'Use your Bank of Memories app credentials',
	OTP_NOTICE = 'Confirmation code has been sent to your e-mail',
	EXPIRED_COUNTER = 'Code has been expired',
	NOT_EXPIRED_COUNTER = 'This code will expire in'
}

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
