/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { HeadingComponent } from './heading.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [HeadingComponent],
	imports: [CommonModule],
	exports: [HeadingComponent],
	bootstrap: []
})
export class GbmHeadingModule {}
