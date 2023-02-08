import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GbmIconModule } from '../icon/icon.module';
import { ToastItemComponent } from './toast-item/toast-item.component';
import { ToastComponent } from './toast.component';

@NgModule({
	declarations: [ToastItemComponent, ToastComponent],
	imports: [CommonModule, GbmIconModule],
	exports: [ToastComponent]
})
export class ToastModule {}
