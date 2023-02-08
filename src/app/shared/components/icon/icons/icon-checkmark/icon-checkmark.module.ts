import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCheckmarkComponent } from './icon-checkmark.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCheckmarkComponent]
})
export class IconCheckmarkModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ checkmark: IconCheckmarkComponent });
	}
}
