import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconHouseComponent } from './icon-house.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconHouseComponent]
})
export class IconHouseModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ house: IconHouseComponent });
	}
}
