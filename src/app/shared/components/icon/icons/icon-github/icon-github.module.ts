import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconService } from '../../icon.service';
import { IconGithubComponent } from './icon-github.component';

@NgModule({
	imports: [CommonModule],
	declarations: [IconGithubComponent]
})
export class IconGithubModule {
	constructor(iconService: IconService) {
		iconService.registerIcon({ github: IconGithubComponent });
	}
}
