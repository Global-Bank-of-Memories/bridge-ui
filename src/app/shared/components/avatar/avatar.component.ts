import { Component, Input } from '@angular/core';

@Component({
	selector: 'gbm-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.less']
})
export class GbmAvatarComponent {
	@Input()
	public abbr!: string;
}
