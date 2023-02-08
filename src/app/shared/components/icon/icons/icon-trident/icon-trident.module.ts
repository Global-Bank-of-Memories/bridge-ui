import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconTridentComponent } from './icon-trident.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconTridentComponent]
})
export class IconTridentModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ trident: IconTridentComponent });
	}
}
