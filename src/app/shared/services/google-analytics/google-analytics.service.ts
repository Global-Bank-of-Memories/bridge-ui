import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GbmGoogleAnalyticsCategories, GbmGoogleAnalyticsEvents } from './google-analytics.model';

@Injectable({
	providedIn: 'root'
})
export class GbmGoogleAnalyticsService {
	constructor(private $gaService: GoogleAnalyticsService) {}

	public onGbmButtonClick(
		actionName: GbmGoogleAnalyticsEvents,
		categoryName: string,
		isExternalNavigate: boolean
	): void {
		this.$gaService.event(actionName, categoryName);

		if (isExternalNavigate) {
			this.$gaService.event(GbmGoogleAnalyticsEvents.EXTERNAL_NAVIGATE, GbmGoogleAnalyticsEvents.EXTERNAL_NAVIGATE);
		} else {
			this.$gaService.event(GbmGoogleAnalyticsEvents.INTERNAL_NAVIGATE, GbmGoogleAnalyticsEvents.INTERNAL_NAVIGATE);
		}
	}

	public onHttpErrorRequest(apiName: string | undefined): void {
		const gaApiName = `${GbmGoogleAnalyticsEvents.HTTP_ERROR}_${apiName || ''}`;
		this.$gaService.event(gaApiName, GbmGoogleAnalyticsCategories.PERFOMANCE_METRICS);
	}

	public onHttpPendingRequest(apiName: string | undefined): void {
		const gaApiName = `${GbmGoogleAnalyticsEvents.HTTP_PENDING}_${apiName || ''}`;
		this.$gaService.event(gaApiName, GbmGoogleAnalyticsCategories.PERFOMANCE_METRICS);
	}
}
