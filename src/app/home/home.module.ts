import { CommonModule, DecimalPipe } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';

// Components
import { HomeComponent } from './home.component';

// Modules
import { GbmButtonModule } from '@shared/components/button/button.module';
import { GbmHeadingModule } from '@shared/components/heading/heading.module';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { GbmSpinnerModule } from '@shared/components/spinner/spinner.module';
import { BridgeFormComponent } from './components/bridge-form/bridge-form.component';
import { BridgeWalletComponent } from './components/bridge-wallet/bridge-wallet.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GbmAutoFocusModule } from '@shared/directives/autofocus/autofocus.module';
import { WalletsDropdownComponent } from './components/wallets-dropdown/wallets-dropdown.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
	declarations: [HomeComponent, BridgeFormComponent, BridgeWalletComponent, WalletsDropdownComponent],
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
		NgbTooltipModule
	],
	providers: [DecimalPipe]
})
export class HomeModule {}
