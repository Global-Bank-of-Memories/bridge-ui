import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@auth/auth.component';
import { AuthGuardService } from '@auth/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		loadChildren: async (): Promise<unknown> => import('./home/home.module').then(module => module.HomeModule),
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
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
