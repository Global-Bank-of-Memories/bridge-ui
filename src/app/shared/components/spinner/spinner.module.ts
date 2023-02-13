/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { GbmSpinnerContainerDirective } from './spinner.directive';

@NgModule({
	declarations: [SpinnerComponent, GbmSpinnerContainerDirective],
	imports: [CommonModule],
	exports: [SpinnerComponent, GbmSpinnerContainerDirective]
})
export class GbmSpinnerModule {}
