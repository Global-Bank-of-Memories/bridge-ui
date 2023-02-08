import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconRedditComponent } from './icon-reddit.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconRedditComponent]
})
export class IconRedditModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ reddit: IconRedditComponent });
	}
}
