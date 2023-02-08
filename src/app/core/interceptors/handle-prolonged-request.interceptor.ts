import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { GbmAbstractHandleProlongedRequestInterceptor } from '@shared/interceptors/handle-prolonged-request/abstract-handle-prolonged-request.interceptor';
import { environment } from '@environments/environment';
import { GbmRequestApis } from '../../shared/interceptors/handle-prolonged-request/handle-prolonged-request.interceptor.model';
import { GbmGoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';

@Injectable({
	providedIn: 'root'
})
export class HandleProlongedRequestInterceptor extends GbmAbstractHandleProlongedRequestInterceptor {
	protected apis: GbmRequestApis[];

	constructor(toastService: ToastService, googleAnalyticsService: GbmGoogleAnalyticsService) {
		super(toastService, googleAnalyticsService);
		this.apis = [
			{
				name: 'Web API',
				url: environment.apiUrl,
				delay: 5000,
				message: {
					header: 'Connection is slow.',
					body: 'Too long request on'
				}
			},
			{
				name: 'GBM API',
				url: environment.gbmApiUrl,
				delay: 10000,
				message: {
					header: 'Connection is slow.',
					body: 'Too long request on'
				}
			}
		];
	}
}
