import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconZoomOutComponent } from './icon-zoom-out.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconZoomOutComponent]
})
export class IconZoomOutModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ zoomOut: IconZoomOutComponent });
	}
}
