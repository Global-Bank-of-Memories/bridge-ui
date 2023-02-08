import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconLangComponent } from './icon-lang.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconLangComponent]
})
export class IconLangModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ lang: IconLangComponent });
	}
}
