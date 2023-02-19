import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BridgeDataService } from '@bridge/services/bridge-data.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';

@Component({
	selector: 'br-bridge-sign',
	templateUrl: './bridge-sign.component.html',
	styleUrls: ['./bridge-sign.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE_ANIMATION]
})
export class BridgeSignComponent {
	@Input()
	public password = '';

	@Output()
	public passwordChange: EventEmitter<string> = new EventEmitter<string>();

	constructor(public bridgeDataService: BridgeDataService) {}
}
