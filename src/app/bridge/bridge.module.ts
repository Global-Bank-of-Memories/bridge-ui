import { BRIDGE_FEATURE_KEY } from './state/bridge.actions';
import { BridgeAccountsComponent } from './components/bridge-accounts/bridge-accounts.component';
import { BridgeComponent } from './bridge.component';
import { BridgeEffects } from './state/bridge.effects';
import { BridgeFooterComponent } from './components/bridge-footer/bridge-footer.component';
import { BridgeFormComponent } from './components/bridge-form/bridge-form.component';
import { BridgeLoggerComponent } from './components/bridge-logger/bridge-logger.component';
import { BridgeSignComponent } from './components/bridge-sign/bridge-sign.component';
import { ClipboardModule } from 'ngx-clipboard';
import { CommonModule, DecimalPipe } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GbmAutoFocusModule } from '@shared/directives/autofocus/autofocus.module';
import { GbmButtonModule } from '@shared/components/button/button.module';
import { GbmHeadingModule } from '@shared/components/heading/heading.module';
import { GbmIconModule } from '@shared/components/icon/icon.module';
import { GbmSpinnerModule } from '@shared/components/spinner/spinner.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { wrappedBridgeReducer } from './state/bridge.reducers';
import { BridgeRoutingModule } from './bridge-routing.module';

@NgModule({
	declarations: [
		BridgeComponent,
		BridgeAccountsComponent,
		BridgeFormComponent,
		BridgeSignComponent,
		BridgeLoggerComponent,
		BridgeFooterComponent
	],
	exports: [BridgeComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BridgeRoutingModule,
		EffectsModule.forFeature([BridgeEffects]),
		StoreModule.forFeature(BRIDGE_FEATURE_KEY, wrappedBridgeReducer),
		ClipboardModule,
		NgbTooltipModule,
		GbmButtonModule,
		GbmHeadingModule,
		GbmIconModule,
		GbmSpinnerModule,
		GbmAutoFocusModule
	],
	providers: [DecimalPipe]
})
export class BridgeModule {}
