import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconGbmCoinComponent } from './icon-gbm-coin.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconGbmCoinComponent]
})
export class IconGbmCoinModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ gbmCoin: IconGbmCoinComponent });
	}
}
