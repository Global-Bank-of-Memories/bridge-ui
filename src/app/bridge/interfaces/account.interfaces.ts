import { AccountAliases, AccountIDs, AccountTitles } from '@bridge/enums/account.enum';

export interface IAccount {
	id: AccountIDs;
	title: AccountTitles;
	alias: AccountAliases;
	icon: IAccountIcon;
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

export interface IAccountIcon {
	name: string;
	fill: string;
}
