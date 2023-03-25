import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { BridgeComponent } from '@home/components/bridge/bridge.component';
import {StakingComponent} from '@home/components/staking/staking.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{
				path: 'bridge',
				component: BridgeComponent
			},
			{
				path: 'staking',
				component: StakingComponent
			},
			{
				path: '',
				redirectTo: '/bridge',
				pathMatch: 'full'
			}
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule {}
