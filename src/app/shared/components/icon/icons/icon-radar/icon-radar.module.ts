import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconRadarComponent } from './icon-radar.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconRadarComponent]
})
export class IconRadarModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ radar: IconRadarComponent });
	}
}
