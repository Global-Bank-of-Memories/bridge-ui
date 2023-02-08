import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastService } from '@shared/components/toast/toast.service';
import { catchError } from 'rxjs/operators';
import { GbmRequestApis } from '../handle-prolonged-request/handle-prolonged-request.interceptor.model';
import { GbmGoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root'
})
export abstract class GbmAbstractHandleErrorRequestInterceptor implements HttpInterceptor {
	protected abstract apis: GbmRequestApis[];

	constructor(private toastService: ToastService, private googleAnalyticsService: GbmGoogleAnalyticsService) {}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const fetchedApi = this.apis.find(api => api.url === this.getReqOriginUrl(req));

		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				this.showErrorAlert(fetchedApi);
				return throwError(error);
			})
		);
	}

	private showErrorAlert(fetchedApi: GbmRequestApis | undefined): void {
		const headerMessage = fetchedApi?.message?.header || 'Gateway Error.';
		const bodyMessage = this.getBodyMessage(fetchedApi);

		this.toastService.addAlertDanger({
			header: headerMessage,
			body: bodyMessage
		});

		this.googleAnalyticsService.onHttpErrorRequest(fetchedApi?.name);
	}

	private getBodyMessage(fetchedApi: GbmRequestApis | undefined): string {
		if (fetchedApi) {
			return `${fetchedApi.message.body} ${fetchedApi.name}`;
		}

		return 'Request failed';
	}

	private getReqOriginUrl(req: HttpRequest<unknown>): string {
		if (req.url.includes('./assets')) {
			return environment.apiUrl;
		}
		return new URL(req.url).origin;
	}
}
