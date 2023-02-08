import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconChipComponent } from './icon-chip.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconChipComponent]
})
export class IconChipModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ chip: IconChipComponent });
	}
}
