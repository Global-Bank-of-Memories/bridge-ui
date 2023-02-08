import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconCancelComponent } from './icon-cancel.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconCancelComponent]
})
export class IconCancelModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ cancel: IconCancelComponent });
	}
}
