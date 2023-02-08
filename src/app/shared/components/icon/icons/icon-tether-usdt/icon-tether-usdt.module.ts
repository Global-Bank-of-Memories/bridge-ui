import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconTetherUsdtComponent } from './icon-tether-usdt.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconTetherUsdtComponent]
})
export class IconTetherUsdtModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ usdt: IconTetherUsdtComponent });
	}
}
