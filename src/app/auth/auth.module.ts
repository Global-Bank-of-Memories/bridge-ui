import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { GbmSpinnerModule } from '@shared/components/spinner/spinner.module';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { GbmButtonModule } from '@shared/components/button/button.module';
import { GbmHeadingModule } from '@shared/components/heading/heading.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountDownComponent } from './components/count-down/count-down.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [AuthComponent, LoginComponent, OtpModalComponent, CountDownComponent],
	exports: [AuthComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		GbmIconModule,
		GbmSpinnerModule,
		GbmButtonModule,
		GbmHeadingModule,
		NgOtpInputModule
	]
})
export class AuthModule {}
