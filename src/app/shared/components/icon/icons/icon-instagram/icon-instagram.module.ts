import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconInstagramComponent } from './icon-instagram.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconInstagramComponent]
})
export class IconInstagramModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ instagram: IconInstagramComponent });
	}
}
