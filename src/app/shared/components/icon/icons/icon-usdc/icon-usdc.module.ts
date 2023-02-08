import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconUsdcComponent } from './icon-usdc.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconUsdcComponent]
})
export class IconUsdcModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ usdc: IconUsdcComponent });
	}
}
