/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconChevronDownComponent } from './icon-chevron-down.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconChevronDownComponent]
})
export class IconChevronDownModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ chevronDown: IconChevronDownComponent });
	}
}
