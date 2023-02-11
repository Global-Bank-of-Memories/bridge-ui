import { trigger, transition, useAnimation } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDataResponse, LoginResponse } from '@auth/services/auth/auth.model';
import { AuthService } from '@auth/services/auth/auth.service';
import { fadeInAnimation, FADE_ANIMATION } from '@shared/animations/fade.animation';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import { bounceIn, wobble } from 'ng-animate';
import { timer } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import {
	BASIC_FORM_CONTROLS,
	LoginBasicFormControls,
	LoginFormControls,
	LoginFormGroup,
	LoginFormModel,
	LoginMessagesEnum
} from './login-model';

@Component({
	selector: 'br-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	animations: [
		FADE_ANIMATION,
		fadeInAnimation('1000ms'),
		trigger('success', [transition('void => *', useAnimation(bounceIn))]),
		trigger('error', [transition('void => *', useAnimation(wobble))])
	]
})
export class LoginComponent extends GenericFormBaseComponent<LoginFormControls, LoginFormModel> implements OnInit {
	@ViewChild('sectionLoading') public sectionLoading!: ElementRef;

	public loading = false;
	public submissionDisabled = false;
	public isPreliminaryValid = false;
	public isExpiredCounter = false;
	public validationMessage = '';
	public otpValidationMessage = '';
	public retryTimer!: Date;
	public token!: string;
	public formGroup!: LoginFormGroup;

	public get email(): FormControl {
		return this.formGroup.controls.email;
	}

	public get password(): FormControl {
		return this.formGroup.controls.password;
	}

	public get noticeMessage(): string {
		return this.isPreliminaryValid ? LoginMessagesEnum.OTP_NOTICE : LoginMessagesEnum.APP_CREDENTIALS;
	}

	public get otpNoticeMessage(): string {
		return this.isExpiredCounter ? LoginMessagesEnum.EXPIRED_COUNTER : LoginMessagesEnum.NOT_EXPIRED_COUNTER;
	}

	constructor(
		formBuilder: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private renderer: Renderer2
	) {
		super(formBuilder);
	}

	public ngOnInit(): void {
		this.initForm();
		this.setValidators();
	}

	public onSubmit(): void {
		if (this.formGroup.invalid || this.validationMessage) {
			return;
		}

		const { email, password } = this.formGroup.value;
		this.loading = true;
		this.submissionDisabled = true;

		this.authService
			.login(email, password)
			.pipe(
				map((response: LoginResponse) => response.data),
				tap((loginData: LoginDataResponse) => {
					this.token = loginData.token;
					this.changeModalsWithDelay(loginData.retry);
				}),
				finalize(() => {
					this.loading = false;
					this.submissionDisabled = false;
				})
			)
			.subscribe(
				() => {},
				(err: HttpErrorResponse) => {
					this.isPreliminaryValid = false;
					this.validationMessage = err.error?.error?.msg;
				}
			);
	}

	public onResendOTP(): void {
		this.authService
			.retryOTP(this.token)
			.pipe(tap(response => (this.retryTimer = response.data.retry)))
			.subscribe(
				() => {},
				(err: HttpErrorResponse) => {
					this.otpValidationMessage = err.error?.error?.msg;
				}
			);
	}

	public onCheckOTP(event: string): void {
		this.authService.checkOTP(event, this.token).subscribe(
			res => {
				void this.router.navigate(['/']);
			},
			(err: HttpErrorResponse) => {
				console.log(err);
				this.otpValidationMessage = err.error?.error?.msg;
			}
		);
	}

	public onClearOTPValidation(): void {
		this.otpValidationMessage = '';
	}

	private initForm(): void {
		this.setFormControls<LoginBasicFormControls>({
			basicFormControls: BASIC_FORM_CONTROLS
		});

		this.formGroup = this.getFormForModule();

		this.formGroup.valueChanges.subscribe(() => {
			this.validationMessage = '';
		});
	}

	private setValidators(): void {
		const { email, password } = this.formGroup.controls;

		email.addValidators([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
		password.addValidators([Validators.required]);
	}

	private changeModalsWithDelay(retryTimer: string): void {
		this.renderer.setStyle(
			this.sectionLoading.nativeElement,
			'--height-form',
			`${this.sectionLoading.nativeElement.offsetHeight}px`,
			2
		);

		timer().subscribe(() => {
			this.isPreliminaryValid = true;
			this.retryTimer = new Date(retryTimer);
		});
	}
}
