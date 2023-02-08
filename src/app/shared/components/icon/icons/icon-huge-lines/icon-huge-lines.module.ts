import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconHugeLinesComponent } from './icon-huge-lines.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconHugeLinesComponent]
})
export class IconHugeLinesModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ hugeLines: IconHugeLinesComponent });
	}
}
