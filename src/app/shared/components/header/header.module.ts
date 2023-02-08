import { CommonModule } from '@angular/common';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { HeaderComponent } from '@shared/components/header/header.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [HeaderComponent],
	imports: [CommonModule, GbmIconModule, NgbDropdownModule, RouterModule],
	exports: [HeaderComponent]
})
export class GbmHeaderModule {}
