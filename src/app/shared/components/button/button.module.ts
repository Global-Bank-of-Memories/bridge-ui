/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { ButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';
import { GbmIconModule } from '../icon/icon.module';
import { GbmSpinnerModule } from '../spinner/spinner.module';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [ButtonComponent],
	imports: [CommonModule, GbmIconModule, GbmSpinnerModule],
	exports: [ButtonComponent],
	bootstrap: []
})
export class GbmButtonModule {}
