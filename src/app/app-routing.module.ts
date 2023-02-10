import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@auth/auth.component';
import { AuthGuardService } from '@auth/guards/auth.guard';
import { HomeComponent } from '@home/home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'auth',
		component: AuthComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			initialNavigation: 'enabled',
			scrollPositionRestoration: 'enabled',
			anchorScrolling: 'enabled'
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
