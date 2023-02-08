import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { HomeComponent } from './home.component';

// Modules
import { GbmButtonModule } from '@shared/components/button/button.module';
import { GbmHeadingModule } from '@shared/components/heading/heading.module';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { GbmSpinnerModule } from '@shared/components/spinner/spinner.module';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, GbmButtonModule, GbmHeadingModule, GbmIconModule, GbmSpinnerModule]
})
export class HomeModule {}
