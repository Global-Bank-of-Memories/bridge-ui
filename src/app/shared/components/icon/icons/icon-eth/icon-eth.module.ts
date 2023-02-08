import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconEthComponent } from './icon-eth.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconEthComponent]
})
export class IconEthModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ eth: IconEthComponent });
	}
}
