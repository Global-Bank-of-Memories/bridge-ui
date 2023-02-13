import { OnInit, OnChanges, Directive, Input, HostBinding, Renderer2, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[gbmSpinnerContainer]'
})
export class GbmSpinnerContainerDirective implements OnInit, OnChanges {
	@Input()
	public gbmSpinnerContainer = false;

	@Input()
	public customClass = 'gbm-spinner-mask';

	@HostBinding('style.position')
	public hostPosition = 'relative';

	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	public ngOnInit(): void {
		const loadingContainer = this.renderer.createElement('div');
		this.renderer.addClass(loadingContainer, this.customClass);
		this.renderer.setStyle(loadingContainer, 'display', this.gbmSpinnerContainer ? 'flex' : 'none');
		this.renderer.appendChild(this.elementRef.nativeElement, loadingContainer);
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.gbmSpinnerContainer) {
			const loadingWrapper = this.elementRef.nativeElement.querySelector('.' + this.customClass);
			if (loadingWrapper) {
				this.renderer.setStyle(loadingWrapper, 'display', this.gbmSpinnerContainer ? 'flex' : 'none');
			}
		}
	}
}
