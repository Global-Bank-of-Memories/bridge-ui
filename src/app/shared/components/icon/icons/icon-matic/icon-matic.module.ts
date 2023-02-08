import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconMaticComponent } from './icon-matic.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconMaticComponent]
})
export class IconMaticModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ matic: IconMaticComponent });
	}
}
