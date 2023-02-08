import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconLinkedinComponent } from './icon-linkedin.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconLinkedinComponent]
})
export class IconLinkedinModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ linkedin: IconLinkedinComponent });
	}
}
