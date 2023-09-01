import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'gbm-countdown-timer',
	templateUrl: './countdown-timer.component.html',
	styleUrls: []
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
	@Input() targetDate;
	@Output() isTimerFinished: EventEmitter<boolean> = new EventEmitter<boolean>();
	diff: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	private interval: any;

	ngOnInit(): void {
		this.updateCountdown();
		this.interval = setInterval(() => {
			this.updateCountdown();
		}, 1000);
	}

	updateCountdown(): void {
		this.diff = this.targetDate.getTime() - new Date().getTime();

		if (this.diff <= 0) {
			this.isTimerFinished.emit(true);
			clearInterval(this.interval);
		} else {
			this.days = Math.floor(this.diff / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((this.diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((this.diff % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((this.diff % (1000 * 60)) / 1000);
		}
	}

	ngOnDestroy(): void {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}
}
