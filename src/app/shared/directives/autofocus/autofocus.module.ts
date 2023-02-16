import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GbmAutoFocusDirective } from './autofocus.directive';

@NgModule({
	declarations: [GbmAutoFocusDirective],
	exports: [GbmAutoFocusDirective],
	imports: [CommonModule]
})
export class GbmAutoFocusModule {}
