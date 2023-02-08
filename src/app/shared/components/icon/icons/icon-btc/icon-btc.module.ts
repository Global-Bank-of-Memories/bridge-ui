import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconBtcComponent } from './icon-btc.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconBtcComponent]
})
export class IconBtcModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ btc: IconBtcComponent });
	}
}
