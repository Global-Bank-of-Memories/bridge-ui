import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconGiftComponent } from './icon-gift.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconGiftComponent]
})
export class IconGiftModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ gift: IconGiftComponent });
	}
}
