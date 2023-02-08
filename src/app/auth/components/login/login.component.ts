import { Component } from '@angular/core';

@Component({
	selector: 'br-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent {
	public loading = false;
	public submissionDisabled = false;

	public onSubmit(): void {
		this.loading = true;
		this.submissionDisabled = true;
		setTimeout(() => {
			this.loading = false;
			this.submissionDisabled = false;
		}, 3000);
	}
}
