import { CommonModule } from '@angular/common';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { HeaderComponent } from '@shared/components/header/header.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GbmAvatarModule } from '../avatar/avatar.module';

@NgModule({
	declarations: [HeaderComponent],
	imports: [CommonModule, GbmIconModule, NgbDropdownModule, RouterModule, GbmAvatarModule],
	exports: [HeaderComponent]
})
export class GbmHeaderModule {}
