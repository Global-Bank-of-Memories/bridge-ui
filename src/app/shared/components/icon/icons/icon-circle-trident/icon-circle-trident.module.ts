import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCircleTridentComponent } from './icon-circle-trident.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCircleTridentComponent]
})
export class IconCircleTridentModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ circleTrident: IconCircleTridentComponent });
	}
}
