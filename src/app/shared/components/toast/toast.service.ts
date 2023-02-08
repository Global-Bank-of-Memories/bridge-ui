import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import {
	GbmToastModel,
	GbmToastPositionConfig,
	GbmToastType,
	TOAST_DEFAULT_DELAY,
	TOAST_DEFAULT_TYPE
} from './toast.model';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	private _toasts$: BehaviorSubject<GbmToastModel[]> = new BehaviorSubject<GbmToastModel[]>([]);
	private readonly _alertPositionConfig = GbmToastPositionConfig.TOP_RIGHT;

	public get toasts(): GbmToastModel[] {
		return this._toasts$.value;
	}

	public get toasts$(): Observable<GbmToastModel[]> {
		return this._toasts$.asObservable();
	}

	public get alertPositionConfig(): GbmToastPositionConfig {
		return this._alertPositionConfig;
	}

	constructor() {}

	private removeAlert(toast: GbmToastModel): void {
		this._toasts$.next(this.toasts.filter(t => toast !== t));
	}

	public addAlert(toast: GbmToastModel): void {
		toast.type = toast.type || TOAST_DEFAULT_TYPE;
		toast.delay = toast.delay || TOAST_DEFAULT_DELAY;

		toast.remove = (): void => this.removeAlert(toast);

		if (this.alertPositionConfig.includes('top')) {
			this._toasts$.next([toast, ...this.toasts]);
		} else {
			this._toasts$.next([...this.toasts, toast]);
		}
	}

	public addAlertInfo(toast: GbmToastModel): void {
		toast.type = GbmToastType.INFO;
		this.addAlert(toast);
	}

	public addAlertDanger(toast: GbmToastModel): void {
		toast.type = GbmToastType.DANGER;
		this.addAlert(toast);
	}

	public addAlertWarning(toast: GbmToastModel): void {
		toast.type = GbmToastType.WARNING;
		this.addAlert(toast);
	}

	public addAlertSuccess(toast: GbmToastModel): void {
		toast.type = GbmToastType.SUCCESS;
		this.addAlert(toast);
	}
}
