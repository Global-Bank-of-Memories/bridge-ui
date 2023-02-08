import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconRobotComponent } from './icon-robot.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconRobotComponent]
})
export class IconRobotModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ robot: IconRobotComponent });
	}
}
