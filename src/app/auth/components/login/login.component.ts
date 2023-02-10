import { trigger, transition, useAnimation } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDataResponse, LoginResponse } from '@auth/services/auth/auth.model';
import { AuthService } from '@auth/services/auth/auth.service';
import { fadeInAnimation, FADE_ANIMATION } from '@shared/animations/fade.animation';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import { bounceIn, wobble, fadeIn } from 'ng-animate';
import { map, tap } from 'rxjs/operators';
import {
	BASIC_FORM_CONTROLS,
	LoginBasicFormControls,
	LoginFormControls,
	LoginFormGroup,
	LoginFormModel
} from './login-model';

@Component({
	selector: 'br-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	animations: [
		FADE_ANIMATION,
		fadeInAnimation('1000ms'),
		trigger('success', [transition('void => *', useAnimation(bounceIn))]),
		trigger('error', [transition('void => *', useAnimation(wobble))]),
		trigger('testtest', [transition('void => *', useAnimation(fadeIn, { delay: '5s' }))])
	]
})
export class LoginComponent extends GenericFormBaseComponent<LoginFormControls, LoginFormModel> implements OnInit {
	@ViewChild('test') public testForm!: ElementRef;
	public loading = false;
	public submissionDisabled = false;
	public isPreliminaryValid = false;
	public validationMessage = '';
	public token!: string;
	public formGroup!: LoginFormGroup;

	public get email(): FormControl {
		return this.formGroup.controls.email;
	}

	public get password(): FormControl {
		return this.formGroup.controls.password;
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

		setTimeout(() => {
			this.renderer.setStyle(
				this.testForm.nativeElement,
				'--height-form',
				`${this.testForm.nativeElement.offsetHeight}px`,
				2
			);
			console.log(this.testForm.nativeElement.offsetHeight);
		}, 500);
	}

	private initForm(): void {
		this.setFormControls<LoginBasicFormControls>({
			basicFormControls: BASIC_FORM_CONTROLS
		});

		this.formGroup = this.getFormForModule();
	}

	private setValidators(): void {
		const { email, password } = this.formGroup.controls;

		email.addValidators([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
		password.addValidators([Validators.required]);
	}

	public onSubmit(): void {
		const { email, password } = this.formGroup.value;


		this.authService
			.login(email, password)
			.pipe(
				map((response: LoginResponse) => response.data),
				tap((loginData: LoginDataResponse) => {
					this.isPreliminaryValid = true;
					this.token = loginData.token;
				})
			)
			.subscribe(
				res => {
					console.log(res);
				},
				(err: HttpErrorResponse) => {
					this.isPreliminaryValid = false;

				},
				() => {
					this.loading = false;
					this.submissionDisabled = false;
				}
			);
	}

	public onOtpChange(event: string): void {
		if (event.length === 4) {
			this.authService.checkOTP(event, this.token).subscribe(res => void this.router.navigate(['/']));
		}
	}
}
