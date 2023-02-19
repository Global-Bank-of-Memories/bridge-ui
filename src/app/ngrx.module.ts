import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@environments/environment';
import { metaReducers, ROOT_REDUCERS } from './root.reducer';

@NgModule({
	imports: [
		StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
		EffectsModule.forRoot([]),
		StoreModule.forRoot(ROOT_REDUCERS, {
			metaReducers,
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictStateSerializability: true,
				strictActionSerializability: true
			}
		}),
		!environment.production ? StoreDevtoolsModule.instrument() : []
	]
})
export class NgrxModule {}
