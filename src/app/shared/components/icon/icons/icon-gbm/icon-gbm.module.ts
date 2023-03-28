import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconGbmComponent } from './icon-gbm.component';

@NgModule({
    imports: [CommonModule],
    exports: [
        IconGbmComponent
    ],
    declarations: [IconGbmComponent]
})
export class IconGbmModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ iconGbm: IconGbmComponent });
	}
}
