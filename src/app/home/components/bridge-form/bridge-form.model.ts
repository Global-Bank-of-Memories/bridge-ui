import { FormControl } from '@angular/forms';
import { GenericFormGroup } from '@shared/components/generic-form-base/generic-form-base-model';

export enum BridgeNetworks {
	GBM = 'GBM',
	POLYGON = 'Polygon'
}

export const CurrencyGBMData = {
	title: BridgeNetworks.GBM,
	label: BridgeNetworks.GBM,
	wallet: 'metamask',
	icon: 'eth'
};

export const CurrencyPolygonData = {
	title: BridgeNetworks.POLYGON,
	label: 'WGBM',
	wallet: BridgeNetworks.POLYGON,
	icon: 'matic'
};

export const Networks = [CurrencyPolygonData];

export interface BridgeBasicFormControls {
	from: number;
	to: number;
}

export const BRIDGE_BASIC_FORM_CONTROLS: BridgeBasicFormControls = {
	from: 0.0000001,
	to: 0.0000001
};

export type BridgeFormModel = BridgeBasicFormControls;

export type BridgeFormControls = {
	[key in keyof BridgeFormModel]: FormControl;
};

export type BridgeFormGroup = GenericFormGroup<BridgeBasicFormControls, BridgeFormModel>;

export interface IWalletState {
	id: string;
	title: string;
	abbr: string;
	icon: string;
	iconColor: string;
	connected: boolean;
	selected: boolean;
	balance: string;
	walletId: string;
	placeholder?: string;
	defautValue?: number;
	from?: boolean;
	isPrimary?: boolean;
}

export interface IWalletExchange {
	from: IWalletState | null;
	to: IWalletState | null;
}

export const WalletsState: IWalletState[] = [
	{
		id: 'gbm',
		title: 'GBM',
		abbr: 'GBM',
		icon: 'gbmCoin',
		iconColor: '--blue-60_light',
		connected: false,
		selected: true,
		isPrimary: true,
		from: true,
		balance: '--',
		walletId: '--',
		placeholder: '--'
	},
	{
		id: 'pgn',
		title: 'Polygon',
		abbr: 'WGBM',
		icon: 'matic',
		iconColor: '',
		connected: false,
		selected: true,
		from: false,
		balance: '--',
		walletId: '--',
		placeholder: '--'
	},
	{
		id: 'cnc',
		title: 'Concordium',
		abbr: 'WGBM',
		icon: 'eth',
		iconColor: '',
		connected: false,
		selected: false,
		from: false,
		balance: '--',
		walletId: '--',
		placeholder: '--'
	}
];
