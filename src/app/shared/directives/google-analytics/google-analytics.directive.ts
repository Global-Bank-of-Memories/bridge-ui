/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Directive, HostListener, Input } from '@angular/core';
import { GbmGoogleAnalyticsEventConfig } from '@shared/services/google-analytics/google-analytics.model';
import { GbmGoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';

@Directive({
	selector: '[gbmGoogleAnalytics]'
})
export class GbmGoogleAnalyticsDirective {
	constructor(private readonly googleAnalyticsService: GbmGoogleAnalyticsService) {}

	@Input() googleAnalyticsConfig!: GbmGoogleAnalyticsEventConfig;

	@HostListener('click', ['$event.target'])
	public onClick(element: HTMLElement): void {
		const { actionName, category, isExternalNavigate, label, value } = this.googleAnalyticsConfig;

		this.googleAnalyticsService.onGbmButtonClick(actionName, category, isExternalNavigate);
	}
}
