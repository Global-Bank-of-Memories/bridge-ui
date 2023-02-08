import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconLinesComponent } from './icon-lines.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconLinesComponent]
})
export class IconLinesModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ lines: IconLinesComponent });
	}
}
