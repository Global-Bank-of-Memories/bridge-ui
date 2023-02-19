import { AccountAliases, AccountIcons, AccountIDs, AccountTitles } from '../enums/account.enum';
import { IAccount } from '../interfaces/account.interfaces';

export const Accounts: IAccount[] = [
	{
		id: AccountIDs.GBM,
		title: AccountTitles.GBM,
		alias: AccountAliases.GBM,
		icon: {
			name: AccountIcons.GBM,
			fill: '--blue-60_light'
		},
		connected: false,
		selected: true,
		isPrimary: true,
		from: true,
		showRequestAssets: false,
		balance: '',
		walletId: '',
		placeholder: '--'
	},
	{
		id: AccountIDs.POLYGON,
		title: AccountTitles.POLYGON,
		alias: AccountAliases.POLYGON,
		icon: {
			name: AccountIcons.POLYGON,
			fill: ''
		},
		connected: false,
		selected: true,
		isPrimary: false,
		from: false,
		showRequestAssets: true,
		balance: '',
		walletId: '',
		placeholder: '--'
	},
	{
		id: AccountIDs.CONCORDIUM,
		title: AccountTitles.CONCORDIUM,
		alias: AccountAliases.CONCORDIUM,
		icon: {
			name: AccountIcons.CONCORDIUM,
			fill: ''
		},
		connected: false,
		selected: false,
		isPrimary: false,
		from: false,
		showRequestAssets: true,
		balance: '',
		walletId: '',
		placeholder: '--'
	}
];
