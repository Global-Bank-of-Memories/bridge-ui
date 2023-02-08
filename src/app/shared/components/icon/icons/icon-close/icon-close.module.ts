import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCloseComponent } from './icon-close.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCloseComponent]
})
export class IconCloseModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ close: IconCloseComponent });
	}
}
