import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconPennantComponent } from './icon-pennant.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconPennantComponent]
})
export class IconPennantModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ pennant: IconPennantComponent });
	}
}
