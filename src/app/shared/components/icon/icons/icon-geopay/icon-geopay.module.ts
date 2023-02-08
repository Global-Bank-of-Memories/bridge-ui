import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconGeoPayComponent } from './icon-geopay.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconGeoPayComponent]
})
export class IconGeoPayModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ geopay: IconGeoPayComponent });
	}
}
