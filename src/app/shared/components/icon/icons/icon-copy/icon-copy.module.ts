import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCopyComponent } from './icon-copy.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCopyComponent]
})
export class IconCopyModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ copy: IconCopyComponent });
	}
}
