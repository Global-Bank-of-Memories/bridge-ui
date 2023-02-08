import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconDaiComponent } from './icon-dai.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconDaiComponent]
})
export class IconDaiModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ dai: IconDaiComponent });
	}
}
