import * as IconsCatalog from './icons';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.components';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [CommonModule, ...IconsCatalog.List],
	declarations: [IconComponent],
	exports: [IconComponent]
})
export class GbmIconModule {}
