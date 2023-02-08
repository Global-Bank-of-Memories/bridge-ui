/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { CommonModule } from '@angular/common';
import { GbmIconModule } from '../icon/icon.module';
import { ModalContainerComponent } from './modal-container.component';
import { ModalContainerService } from './modal-container.service';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [ModalContainerComponent],
	imports: [CommonModule, GbmIconModule],
	exports: [ModalContainerComponent],
	providers: [ModalContainerService],
	bootstrap: []
})
export class GbmModalContainerModule {}
