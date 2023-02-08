import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconEuroComponent } from './icon-euro.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconEuroComponent]
})
export class IconEuroModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ euro: IconEuroComponent });
	}
}
