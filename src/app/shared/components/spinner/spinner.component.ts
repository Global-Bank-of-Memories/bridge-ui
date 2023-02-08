import { Component, Input } from '@angular/core';

@Component({
	selector: 'gbm-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent {
	@Input() public color = '#1d0e0b';
	@Input() public width = '120px';
	@Input() public height = '120px';
}
