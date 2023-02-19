import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconConcordiumComponent } from './icon-concordium.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconConcordiumComponent]
})
export class IconConcordiumModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ concordium: IconConcordiumComponent });
	}
}
