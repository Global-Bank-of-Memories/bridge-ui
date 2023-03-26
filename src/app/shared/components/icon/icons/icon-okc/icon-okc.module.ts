import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconOkcComponent } from './icon-okc.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconOkcComponent]
})
export class IconOkcModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ okc: IconOkcComponent });
	}
}
