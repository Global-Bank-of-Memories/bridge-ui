import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconYoutubeComponent } from './icon-youtube.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconYoutubeComponent]
})
export class IconYoutubeModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ youtube: IconYoutubeComponent });
	}
}
