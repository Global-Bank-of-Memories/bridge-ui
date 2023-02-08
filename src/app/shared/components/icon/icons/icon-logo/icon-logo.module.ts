import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconLogoComponent } from './icon-logo.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconLogoComponent]
})
export class IconLogoModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ logo: IconLogoComponent });
	}
}
