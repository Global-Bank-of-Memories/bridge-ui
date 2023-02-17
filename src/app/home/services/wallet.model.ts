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
	showRequestAssets?: boolean;
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
		selected: false,
		from: false,
		balance: '--',
		walletId: '--',
		placeholder: '--',
		showRequestAssets: true
	},
	{
		id: 'cnc',
		title: 'Concordium',
		abbr: 'WGBM',
		icon: 'eth',
		iconColor: '',
		connected: false,
		selected: true,
		from: false,
		balance: '--',
		walletId: '--',
		placeholder: '--',
		showRequestAssets: true
	}
];
