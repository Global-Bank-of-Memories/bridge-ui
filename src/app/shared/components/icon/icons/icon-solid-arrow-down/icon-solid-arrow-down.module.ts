import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconSolidArrowDownComponent } from './icon-solid-arrow-down.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconSolidArrowDownComponent]
})
export class IconSolidArrowDownModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ solidArrowDown: IconSolidArrowDownComponent });
	}
}
