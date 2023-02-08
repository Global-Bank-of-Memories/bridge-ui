/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconChevronUpComponent } from './icon-chevron-up.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconChevronUpComponent]
})
export class IconChevronUpModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ chevronUp: IconChevronUpComponent });
	}
}
