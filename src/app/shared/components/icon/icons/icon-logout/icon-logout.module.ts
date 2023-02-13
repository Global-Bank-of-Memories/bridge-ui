import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconLogoutComponent } from './icon-logout.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconLogoutComponent]
})
export class IconLogoutModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ logout: IconLogoutComponent });
	}
}
