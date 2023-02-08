import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconSwitchComponent } from './icon-switch.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconSwitchComponent]
})
export class IconSwitchModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ switch: IconSwitchComponent });
	}
}
