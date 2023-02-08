import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconExclamationCircleComponent } from './icon-exclamation-circle.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconExclamationCircleComponent]
})
export class IconExclamationCircleModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ exclamationCircle: IconExclamationCircleComponent });
	}
}
