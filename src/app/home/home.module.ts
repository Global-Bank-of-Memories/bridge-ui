import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
import { BridgeWalletsModalComponent } from './components/bridge-wallets-modal/bridge-wallets-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [HomeComponent, BridgeFormComponent, BridgeWalletComponent, BridgeWalletsModalComponent],
	exports: [HomeComponent],
	imports: [
		CommonModule,
		GbmButtonModule,
		GbmHeadingModule,
		GbmIconModule,
		GbmSpinnerModule,
		ClipboardModule,
		NgbModalModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	]
})
export class HomeModule {}
