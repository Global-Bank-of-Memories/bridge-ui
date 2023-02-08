import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconInfinityComponent } from './icon-infinity.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconInfinityComponent]
})
export class IconInfinityModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ infinity: IconInfinityComponent });
	}
}
