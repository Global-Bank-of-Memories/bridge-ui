import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconOkComponent } from './icon-ok.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconOkComponent]
})
export class IconOkModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ ok: IconOkComponent });
	}
}
