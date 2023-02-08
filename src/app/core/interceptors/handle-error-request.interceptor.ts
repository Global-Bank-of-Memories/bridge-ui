import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { environment } from '@environments/environment';
import { GbmRequestApis } from '../../shared/interceptors/handle-prolonged-request/handle-prolonged-request.interceptor.model';
import { GbmAbstractHandleErrorRequestInterceptor } from '@shared/interceptors/handle-error-request/abstract-handle-error-request.interceptor';
import { GbmGoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';

@Injectable({
	providedIn: 'root'
})
export class HandleErrorRequestInterceptor extends GbmAbstractHandleErrorRequestInterceptor {
	protected apis: GbmRequestApis[];

	constructor(toastService: ToastService, googleAnalyticsService: GbmGoogleAnalyticsService) {
		super(toastService, googleAnalyticsService);
		this.apis = [
			{
				name: 'Web API',
				url: environment.apiUrl,
				delay: 5000,
				message: {
					header: 'Gateway Error.',
					body: 'Request failed on'
				}
			},
			{
				name: 'GBM API',
				url: environment.gbmApiUrl,
				delay: 10000,
				message: {
					header: 'Gateway Error.',
					body: 'Request failed on'
				}
			}
		];
	}
}
