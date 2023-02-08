import { Directive, HostListener } from '@angular/core';
import { ToastService } from '../../components/toast/toast.service';

@Directive({
	selector: '[gbmConnectionState]'
})
export class GbmConnectionStateDirective {
	constructor(private toastService: ToastService) {}

	@HostListener('window:offline')
	public getNetworkOfflineEvent(): void {
		this.toastService.addAlertDanger({ header: 'Lost internet connection' });
	}

	@HostListener('window:online')
	public getNetworkOnlineEvent(): void {
		this.toastService.addAlertSuccess({ header: 'Internet connection established' });
	}
}
