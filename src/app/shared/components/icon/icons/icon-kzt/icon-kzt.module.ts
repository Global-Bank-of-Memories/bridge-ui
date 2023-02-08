import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconKztComponent } from './icon-kzt.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconKztComponent]
})
export class IconKztModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ kzt: IconKztComponent });
	}
}
