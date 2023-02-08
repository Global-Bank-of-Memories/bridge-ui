import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GbmGoogleAnalyticsDirective } from './google-analytics.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [GbmGoogleAnalyticsDirective],
	exports: [GbmGoogleAnalyticsDirective]
})
export class GbmGoogleAnalyticsModule {}
