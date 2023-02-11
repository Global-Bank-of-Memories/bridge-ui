import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { NgOtpInputComponent } from 'ng-otp-input';

@Component({
	selector: 'br-otp-modal',
	templateUrl: './otp-modal.component.html',
	styleUrls: ['./otp-modal.component.less'],
	animations: [FADE_ANIMATION]
})
export class OtpModalComponent {
	@Input() public set otpValidationMessage(otpValidationMessage: string) {
		console.log(otpValidationMessage);
		if (otpValidationMessage && this.otpInput) {
			Object.values(this.otpInput.otpForm.controls).forEach(control => {
				control.setErrors({ invalid: true });
			});
		} else if (this.otpInput && !otpValidationMessage) {
			Object.values(this.otpInput.otpForm.controls).forEach(control => {
				control.setErrors(null);
			});
		}
	}

	@Output() public checkOTP = new EventEmitter<string>();
	@Output() public clearOTPValidation = new EventEmitter<boolean>();

	@ViewChild('otpInput') public otpInput!: NgOtpInputComponent;

	public otpFormControl = new FormControl();

	constructor() {
		this.otpFormControl.valueChanges.subscribe(code => {
			Object.values(this.otpInput.otpForm.controls).forEach(control => {
				control.setErrors(null);
				this.clearOTPValidation.emit(true);
			});

			if (code.length === 4) {
				this.checkOTP.emit(code);
			}
		});
	}
}
