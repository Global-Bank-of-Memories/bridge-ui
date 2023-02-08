import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GbmConnectionStateDirective } from './connection-state.directive';

@NgModule({
	declarations: [GbmConnectionStateDirective],
	exports: [GbmConnectionStateDirective],
	imports: [CommonModule]
})
export class GbmConnectionStateModule {}
