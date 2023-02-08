import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconInfoCircleComponent } from './icon-info-circle.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconInfoCircleComponent]
})
export class IconInfoCircleModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ infoCircle: IconInfoCircleComponent });
	}
}
