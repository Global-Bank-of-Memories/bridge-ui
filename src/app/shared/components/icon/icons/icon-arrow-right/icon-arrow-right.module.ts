import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconArrowRightComponent } from './icon-arrow-right.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconArrowRightComponent]
})
export class IconArrowRightModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ arrowRight: IconArrowRightComponent });
	}
}
