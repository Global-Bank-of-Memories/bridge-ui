import { Component, Input } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'br-otp-modal',
	templateUrl: './otp-modal.component.html',
	styleUrls: ['./otp-modal.component.less']
})
export class OtpModalComponent {
	@Input() public token!: string;

	constructor(private authService: AuthService, public activeModal: NgbActiveModal) {}

	public onOtpChange(event: string): void {
		if (event.length === 4) {
			this.authService.checkOTP(event, this.token).subscribe(res => {
				this.activeModal.close(true);
			});
		}
	}

	public submit(): void {
		console.log(this.token);
		this.activeModal.close('1234');
	}
}
