import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { NgOtpInputComponent } from 'ng-otp-input';
import { ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
	selector: 'br-otp-modal',
	templateUrl: './otp-modal.component.html',
	styleUrls: ['./otp-modal.component.less'],
	animations: [FADE_ANIMATION]
})
export class OtpModalComponent implements OnInit, OnDestroy {
	@ViewChild('otpInput') public otpInput!: NgOtpInputComponent;

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	@Input() public set otpValidationMessage(otpValidationMessage: string) {
		if (otpValidationMessage && this.otpInput) {
			this.setControlErrorsState(true);
		} else if (this.otpInput && !otpValidationMessage) {
			this.setControlErrorsState(false);
		}
	}

	@Output() public checkOTP = new EventEmitter<string>();
	@Output() public clearOTPValidation = new EventEmitter<boolean>();

	public otpFormControl = new FormControl();

	constructor() {}

	public ngOnInit(): void {
		this.listenForm();
	}

	private listenForm(): void {
		this.otpFormControl.valueChanges
			.pipe(
				takeUntil(this.destroyed$),
				tap(code => {
					this.setControlErrorsState();
					this.clearOTPValidation.emit(true);

					if (code.length === 4) {
						this.checkOTP.emit(code);
					}
				})
			)
			.subscribe();
	}

	private setControlErrorsState(isInvalid = false): void {
		const { controls } = this.otpInput.otpForm;
		Object.values(controls).forEach(control => control.setErrors(isInvalid ? { invalid: true } : null));
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
