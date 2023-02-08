import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { ToastService } from '@shared/components/toast/toast.service';
import { GbmRequestApis } from './handle-prolonged-request.interceptor.model';
import { GbmGoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root'
})
export abstract class GbmAbstractHandleProlongedRequestInterceptor implements HttpInterceptor {
	protected abstract apis: GbmRequestApis[];

	constructor(private toastService: ToastService, private googleAnalyticsService: GbmGoogleAnalyticsService) {}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const fetchedApi = this.apis.find(api => api.url === this.getReqOriginUrl(req));

		const pendingTimerID = this.getControlRequestPendingTime(fetchedApi, req);
		return next.handle(req).pipe(finalize(() => clearInterval(pendingTimerID)));
	}

	private getControlRequestPendingTime(
		fetchedApi: GbmRequestApis | undefined,
		req: HttpRequest<unknown>
	): ReturnType<typeof setInterval> {
		const delayTime = fetchedApi?.delay || 5000;
		const headerMessage = fetchedApi?.message?.header || 'Connection is slow.';
		const bodyMessage = this.getBodyWarningMessage(fetchedApi, req);

		const startTime = performance.now();

		const controlPendingInterval = setInterval(() => {
			const responseTime = (performance.now() - startTime) / 1000;
			if (responseTime > delayTime / 1000) {
				this.toastService.addAlertWarning({
					header: headerMessage,
					body: bodyMessage
				});

				clearInterval(controlPendingInterval);

				this.googleAnalyticsService.onHttpPendingRequest(fetchedApi?.name);
			}
		}, 1000);

		return controlPendingInterval;
	}

	private getBodyWarningMessage(fetchedApi: GbmRequestApis | undefined, req: HttpRequest<unknown>): string {
		if (fetchedApi) {
			return `Too long request on ${fetchedApi.name} ${this.getReqPath(req)}.`;
		}

		return 'Your network or gateway is slow.';
	}

	private getReqOriginUrl(req: HttpRequest<unknown>): string {
		if (req.url.includes('./assets')) {
			return environment.apiUrl;
		}
		return new URL(req.url).origin;
	}

	private getReqPath(req: HttpRequest<unknown>): string {
		if (req.url.includes('./assets')) {
			return environment.apiUrl;
		}

		const requestParams = new URL(req.url);
		return requestParams.pathname.concat(requestParams.search);
	}
}
