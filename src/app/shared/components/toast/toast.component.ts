import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
	GbmToastModel,
	GbmToastPositionConfig,
	GbmToastStyleModel,
	GbmToastType,
	styleMap,
	TOAST_DEFAULT_RETENTION_TINE
} from './toast.model';
import { ToastService } from './toast.service';

@Component({
	selector: 'gbm-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.less']
})
export class ToastComponent implements AfterViewInit {
	@ViewChild('alertWrapper', { read: ElementRef })
	private alertWrapperElement!: ElementRef;

	public toasts$: Observable<GbmToastModel[]> = this.toastService.toasts$;
	public alertPosition: GbmToastPositionConfig = this.toastService.alertPositionConfig;
	public retentionTime = TOAST_DEFAULT_RETENTION_TINE;

	constructor(private toastService: ToastService, private renderer: Renderer2) {}

	public ngAfterViewInit(): void {
		this.setAlertConfigStyle();
	}

	public setAlertConfigStyle(): void {
		switch (this.alertPosition) {
			case GbmToastPositionConfig.TOP_RIGHT:
				this.renderer.addClass(this.alertWrapperElement.nativeElement, 'top-right');
				break;
			case GbmToastPositionConfig.TOP_LEFT:
				this.renderer.addClass(this.alertWrapperElement.nativeElement, 'top-left');
				break;
			case GbmToastPositionConfig.BOTTOM_RIGHT:
				this.renderer.addClass(this.alertWrapperElement.nativeElement, 'bottom-right');
				break;
			case GbmToastPositionConfig.BOTTOM_LEFT:
				this.renderer.addClass(this.alertWrapperElement.nativeElement, 'bottom-left');
				break;
			default:
				this.renderer.addClass(this.alertWrapperElement.nativeElement, 'top-right');
				break;
		}
	}

	public getStyleMap(alertType: GbmToastType | undefined): GbmToastStyleModel {
		if (alertType) {
			return styleMap.get(alertType) as GbmToastStyleModel;
		}
		return styleMap.get(GbmToastType.DEFAULT) as GbmToastStyleModel;
	}
}
