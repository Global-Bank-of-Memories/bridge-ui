/* eslint-disable @typescript-eslint/indent */
import { ACCESS_TOKEN_STORAGE_KEY } from '@auth/services/auth/auth.model';
import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { GbmCancelPendingRequestInterceptor } from '@shared/interceptors/cancel-interrupting-request/cancel-interrupting-request.interceptor';
import { GbmHeaderModule } from '@shared/components/header/header.module';
import { GbmThemeModule } from '@shared/services/theme/theme.module';
import { HandleErrorRequestInterceptor } from './core/interceptors/handle-error-request.interceptor';
import { HandleProlongedRequestInterceptor } from './core/interceptors/handle-prolonged-request.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { ToastModule } from '@shared/components/toast/toast.module';
import { HomeModule } from '@home/home.module';
import { GbmConnectionStateModule } from '@shared/directives/connection-state/connection-state.module';
import { JwtInterceptor } from '@auth/interceptors/auth.interceptor';
import { GbmService } from '@home/services/gbm/gbm.service';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ToastModule,
		AuthModule,
		HomeModule,
		HttpClientModule,
		NgxGoogleAnalyticsModule.forRoot(environment.googleAnalyticsKey),
		JwtModule.forRoot({
			config: {
				tokenGetter: () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
			}
		}),
		NgxGoogleAnalyticsRouterModule,
		NgbModule,
		GbmHeaderModule,
		GbmThemeModule,
		GbmConnectionStateModule
	],
	providers: [
		AppService,
		{
			provide: APP_INITIALIZER,
			useFactory:
				(app: AppService): unknown =>
				(): unknown =>
					app.injectWeb3(),
			deps: [AppService],
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: GbmCancelPendingRequestInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HandleProlongedRequestInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HandleErrorRequestInterceptor,
			multi: true
		},
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
