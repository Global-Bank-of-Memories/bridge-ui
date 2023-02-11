import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { LoginMessagesEnum } from '../login/login-model';

@Component({
	selector: 'br-count-down',
	templateUrl: './count-down.component.html',
	styleUrls: ['./count-down.component.less']
})
export class CountDownComponent implements OnDestroy {
	@Output() public expiredCounter = new EventEmitter<boolean>();
	@Output() public resendOTP = new EventEmitter<boolean>();

	@Input() public set retryTimer(retryTimer: Date) {
		this._retryTimer = retryTimer;

		this.subscription?.unsubscribe();
		this.subscription = interval(1000).subscribe(() => this.getTimeDifference());

		this.warningTimer = false;
		this.isExpired = false;
	}
	public get retryTimer(): Date {
		return this._retryTimer;
	}
	private _retryTimer!: Date;

	private subscription!: Subscription;
	private twoDigitsZero = '0';

	public milliSecondsInASecond = 1000;
	public minutesInAnHour = 60;
	public secondsInAMinute = 60;

	public secondsToExpired!: string;
	public minutesToExpired!: string;

	public warningTimer = false;
	public isExpired = false;

	public get otpNoticeMessage(): string {
		return this.isExpired ? LoginMessagesEnum.EXPIRED_COUNTER : LoginMessagesEnum.NOT_EXPIRED_COUNTER;
	}

	public onResendOTP(): void {
		this.resendOTP.emit(true);
	}

	private getTimeDifference(): void {
		const dateNow = this.subtractHoursFromDate(
			new Date(),
			Math.abs(new Date().getTimezoneOffset() / this.minutesInAnHour)
		);
		const timeDifference = new Date(this.retryTimer).getTime() - dateNow.getTime();
		this.allocateTimeUnits(timeDifference);

		this.checkTimer();
	}

	private allocateTimeUnits(timeDifference: number): void {
		this.minutesToExpired = Math.floor(
			(timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) % this.secondsInAMinute
		).toString();

		this.secondsToExpired = (
			this.twoDigitsZero + Math.floor((timeDifference / this.milliSecondsInASecond) % this.secondsInAMinute).toString()
		).slice(-2);
	}

	private checkTimer(): void {
		if (this.isCounterExpired(true)) {
			this.warningTimer = true;
		}

		if (this.isCounterExpired()) {
			this.clearCounter();
		}
	}

	private subtractHoursFromDate(date: Date, hours: number): Date {
		date.setHours(date.getHours() - hours);

		return date;
	}

	private clearCounter(): void {
		this.isExpired = true;
		this.warningTimer = false;

		this.expiredCounter.emit(true);
		this.subscription.unsubscribe();
	}

	private isCounterExpired(warning = false): boolean {
		const borderToExpired = warning ? 10 : 0;
		return +this.minutesToExpired <= 0 && +this.secondsToExpired <= borderToExpired;
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
