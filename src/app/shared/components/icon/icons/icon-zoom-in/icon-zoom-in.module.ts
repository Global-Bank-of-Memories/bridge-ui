import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconZoomInComponent } from './icon-zoom-in.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconZoomInComponent]
})
export class IconZoomInModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ zoomIn: IconZoomInComponent });
	}
}
