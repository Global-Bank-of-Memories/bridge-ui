import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ActivationEnd, Router, Event } from '@angular/router';
import { NON_CANCELLABLE_HEADER_NAME } from './cancel-interrupting-request.interceptor.model';

@Injectable({
	providedIn: 'root'
})
export class GbmCancelPendingRequestInterceptor implements HttpInterceptor {
	private cancelPendingRequest$: Observable<Event> = this.router.events.pipe(
		filter(event => event instanceof ActivationEnd)
	);

	constructor(private router: Router) {}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const isCancellable = !req.headers.has(NON_CANCELLABLE_HEADER_NAME);
		const cleanedHeaders = req.headers.delete(NON_CANCELLABLE_HEADER_NAME);
		req = req.clone({ headers: cleanedHeaders });

		return isCancellable ? next.handle(req).pipe(takeUntil(this.cancelPendingRequest$)) : next.handle(req);
	}
}
