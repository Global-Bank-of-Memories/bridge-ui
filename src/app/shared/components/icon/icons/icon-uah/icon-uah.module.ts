import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconUahComponent } from './icon-uah.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconUahComponent]
})
export class IconUahModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ uah: IconUahComponent });
	}
}
