import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconChainlinkComponent } from './icon-chainlink.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconChainlinkComponent]
})
export class IconChainlinkModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ chainlink: IconChainlinkComponent });
	}
}
