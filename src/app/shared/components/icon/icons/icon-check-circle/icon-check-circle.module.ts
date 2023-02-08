import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCheckCircleComponent } from './icon-check-circle.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCheckCircleComponent]
})
export class IconCheckCircleModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ checkCircle: IconCheckCircleComponent });
	}
}
