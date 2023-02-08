import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconFbComponent } from './icon-fb.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconFbComponent]
})
export class IconFbModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ fb: IconFbComponent });
	}
}
