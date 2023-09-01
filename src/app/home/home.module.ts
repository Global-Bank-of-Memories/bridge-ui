import { CommonModule, DecimalPipe } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';

// Components
import { HomeComponent } from './home.component';

// Modules
import { GbmButtonModule } from '@shared/components/button/button.module';
import { GbmHeadingModule } from '@shared/components/heading/heading.module';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { GbmSpinnerModule } from '@shared/components/spinner/spinner.module';
import { BridgeFormComponent } from './components/bridge/bridge-form/bridge-form.component';
import { BridgeWalletComponent } from './components/bridge/bridge-wallet/bridge-wallet.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GbmAutoFocusModule } from '@shared/directives/autofocus/autofocus.module';
import { WalletsDropdownComponent } from './components/wallets-dropdown/wallets-dropdown.component';
import { HomeRoutingModule } from './home-routing.module';
import { BridgeComponent } from './components/bridge/bridge.component';
import { StakingComponent } from './components/staking/staking.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GbmCountDownModule } from '@shared/components/countdown-timer/countdown-timer.module';

@NgModule({
	declarations: [
		HomeComponent,
		BridgeFormComponent,
		BridgeWalletComponent,
		WalletsDropdownComponent,
		BridgeComponent,
		StakingComponent
	],
	exports: [HomeComponent],
	imports: [
		CommonModule,
		HomeRoutingModule,
		GbmButtonModule,
		GbmHeadingModule,
		GbmIconModule,
		GbmSpinnerModule,
		ClipboardModule,
		NgbModalModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		GbmAutoFocusModule,
		NgbTooltipModule,
		NgxSliderModule,
		GbmCountDownModule
	],
	providers: [DecimalPipe]
})
export class HomeModule {}
