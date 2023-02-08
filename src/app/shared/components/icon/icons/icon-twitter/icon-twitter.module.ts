import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconTwitterComponent } from './icon-twitter.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconTwitterComponent]
})
export class IconTwitterModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ twitter: IconTwitterComponent });
	}
}
