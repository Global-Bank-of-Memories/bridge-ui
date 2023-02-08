import { Component } from '@angular/core';

@Component({
	selector: 'br-bridge-form',
	templateUrl: './bridge-form.component.html',
	styleUrls: ['./bridge-form.component.less']
})
export class BridgeFormComponent {
	public loading = false;
	public submissionDisabled = false;
	public switchIcon = {
		name: 'switch',
		fill: 'var(--static-white)'
	};

	public onSubmit(): void {
		this.loading = true;
		this.submissionDisabled = true;
		setTimeout(() => {
			this.loading = false;
			this.submissionDisabled = false;
		}, 3000);
	}
}
