import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BridgeDataService } from '@bridge/services/bridge-data.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { ILog, LoggerColor, LoggerType, LOG_LIMIT } from './bridge-logger.model';

@Component({
	selector: 'br-bridge-logger',
	templateUrl: './bridge-logger.component.html',
	styleUrls: ['./bridge-logger.component.less'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [FADE_ANIMATION]
})
export class BridgeLoggerComponent implements OnInit {
	@Input()
	public log!: ILog;

	@Output()
	public update: EventEmitter<ILog> = new EventEmitter<ILog>();

	constructor(public bridgeDataService: BridgeDataService) {}

	public ngOnInit(): void {
		// const interval = setInterval(() => {
		// 	this.setLog('Some message Some message Some message');
		// 	if (this.log.data.length >= LOG_LIMIT) {
		// 		clearInterval(interval);
		// 	}
		// }, 2000);
	}

	public setLog(message: string, type: LoggerType = LoggerType.DEFAULT): void {
		if (this.log.data.length >= LOG_LIMIT) {
			this.log.data = '';
			return;
		}

		const loggerContainer = document.querySelector('#logger-container');
		const cssClass = LoggerColor[type];
		this.log.data += `<p class="${cssClass}">> ${new Date().toLocaleTimeString()}: ${message}</p>`;
		this.log.updatedDate = new Date();
		this.update.emit(this.log);

		if (loggerContainer) {
			setTimeout(() => loggerContainer.scroll({ behavior: 'smooth', top: loggerContainer.scrollHeight }));
		}
	}
}
