import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconExternalLinkComponent } from './icon-external-link.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconExternalLinkComponent]
})
export class IconExternalLinkModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ externalLink: IconExternalLinkComponent });
	}
}
