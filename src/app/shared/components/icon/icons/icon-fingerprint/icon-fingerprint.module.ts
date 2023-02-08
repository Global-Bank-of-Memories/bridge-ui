import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconFingerprintComponent } from './icon-fingerprint.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconFingerprintComponent]
})
export class IconFingerprintModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ fingerprint: IconFingerprintComponent });
	}
}
