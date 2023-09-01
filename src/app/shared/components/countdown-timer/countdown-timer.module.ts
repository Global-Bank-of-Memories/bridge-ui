/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { CountdownTimerComponent } from './countdown-timer.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [CountdownTimerComponent],
	imports: [CommonModule],
	exports: [CountdownTimerComponent],
	bootstrap: []
})
export class GbmCountDownModule {}
