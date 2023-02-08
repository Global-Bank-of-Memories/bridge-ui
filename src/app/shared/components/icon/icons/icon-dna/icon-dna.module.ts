import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconDnaComponent } from './icon-dna.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconDnaComponent]
})
export class IconDnaModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ dna: IconDnaComponent });
	}
}
