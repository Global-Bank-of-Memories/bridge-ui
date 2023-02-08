import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GbmAvatarComponent } from './avatar.component';

@NgModule({
	declarations: [GbmAvatarComponent],
	exports: [GbmAvatarComponent],
	imports: [CommonModule]
})
export class GbmAvatarModule {}
