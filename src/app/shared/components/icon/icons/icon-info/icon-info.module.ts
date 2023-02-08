import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconInfoComponent } from './icon-info.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconInfoComponent]
})
export class IconInfoModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ info: IconInfoComponent });
	}
}
