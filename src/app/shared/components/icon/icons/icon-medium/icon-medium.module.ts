import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconMediumComponent } from './icon-medium.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconMediumComponent]
})
export class IconMediumModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ medium: IconMediumComponent });
	}
}
