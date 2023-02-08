import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
	GbmToastModel,
	GbmToastPositionConfig,
	GbmToastStyleModel,
	TOAST_ANIMATION_DURATION,
	TOAST_ANIMATION_SPACE,
	TOAST_DEFAULT_DELAY
} from '@shared/components/toast/toast.model';
import { Subject, timer } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';

@Component({
	selector: 'gbm-toast-item',
	templateUrl: './toast-item.component.html',
	styleUrls: ['./toast-item.component.less']
})
export class ToastItemComponent implements AfterViewInit {
	@Input()
	public alertToast!: GbmToastModel | null;

	@Input()
	public position!: GbmToastPositionConfig;

	@Input()
	public styleMap!: GbmToastStyleModel;

	@Input()
	public retentionTime!: number;

	@ViewChild('toast', { read: ElementRef })
	private toastElement!: ElementRef;

	@ViewChild('progressBar', { read: ElementRef })
	private progressBarElement!: ElementRef;

	public unsubscribeTimerSubject = new Subject();

	constructor(private renderer: Renderer2) {}

	public ngAfterViewInit(): void {
		const delayTime = this.alertToast?.delay || TOAST_DEFAULT_DELAY;
		const lifeTime = delayTime - this.retentionTime;

		this.setAnimationsProperties(delayTime);

		timer(this.retentionTime)
			.pipe(
				takeUntil(this.unsubscribeTimerSubject),
				tap(() => {
					this.renderer.addClass(this.toastElement.nativeElement, 'active');
					this.renderer.addClass(this.progressBarElement.nativeElement, 'active');
				}),
				delay(lifeTime),
				tap(() => this.renderer.removeClass(this.toastElement.nativeElement, 'active')),
				delay(this.retentionTime),
				tap(() => this.alertToast?.remove?.())
			)
			.subscribe(() => this.unsubscribeTimerSubject.next());
	}

	public setAnimationsProperties(delayTime: number): void {
		this.renderer.setStyle(
			this.progressBarElement.nativeElement,
			'--progress-color',
			`${this.styleMap.progressColor}`,
			2
		);
		this.renderer.setStyle(this.progressBarElement.nativeElement, '--transition-duration', `${delayTime}ms`, 2);

		if (this.position.includes('left')) {
			this.renderer.setStyle(
				this.toastElement.nativeElement,
				'--transition-direction',
				`-${TOAST_ANIMATION_DURATION}`,
				2
			);
			this.renderer.setStyle(this.toastElement.nativeElement, '--transition-space', `-${TOAST_ANIMATION_SPACE}`, 2);
		} else {
			this.renderer.setStyle(
				this.toastElement.nativeElement,
				'--transition-direction',
				`${TOAST_ANIMATION_DURATION}`,
				2
			);
			this.renderer.setStyle(this.toastElement.nativeElement, '--transition-space', `${TOAST_ANIMATION_SPACE}`, 2);
		}
	}

	public onRemoveAlert(): void {
		timer(0)
			.pipe(
				tap(() => this.renderer.removeClass(this.toastElement.nativeElement, 'active')),
				delay(this.retentionTime),
				tap(() => this.alertToast?.remove?.())
			)
			.subscribe();
	}
}
