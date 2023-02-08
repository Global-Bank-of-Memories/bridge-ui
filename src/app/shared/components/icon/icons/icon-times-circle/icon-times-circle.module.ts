import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconTimesCircleComponent } from './icon-times-circle.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconTimesCircleComponent]
})
export class IconTimesCircleModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ timesCircle: IconTimesCircleComponent });
	}
}
