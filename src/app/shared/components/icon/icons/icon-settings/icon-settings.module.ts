import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconSettingsComponent } from './icon-settings.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconSettingsComponent]
})
export class IconSettingsModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ settings: IconSettingsComponent });
	}
}
