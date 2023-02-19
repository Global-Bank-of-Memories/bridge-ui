import { AccountIDs } from '@bridge/enums/account.enum';
import {
	IBridgeConstantsData,
	IConcordiumConstantsData,
	IPolygonConstantsData,
	IStellarConstantsData
} from '@bridge/services/common-bridge/common-bridge.model';
import { createAction, props } from '@ngrx/store';
import { ISubmitState } from '../components/bridge-form/bridge-form.model';
import { IAccount } from '../interfaces/account.interfaces';

export const BRIDGE_FEATURE_KEY = 'bridge';

export const BridgeActions = {
	init: createAction(`[${BRIDGE_FEATURE_KEY}]: Initialize module`),
	getBridgeConstants: createAction(`[${BRIDGE_FEATURE_KEY}]: Get bridge constants`),
	setBridgeConstants: createAction(
		`[${BRIDGE_FEATURE_KEY}]: Set bridge constants`,
		props<{
			constant: {
				[key: string]: IBridgeConstantsData | IStellarConstantsData | IPolygonConstantsData | IConcordiumConstantsData;
			};
		}>()
	),
	setAccounts: createAction(`[${BRIDGE_FEATURE_KEY}]: Set accounts`, props<{ accounts: IAccount[] }>()),
	switchAccounts: createAction(`[${BRIDGE_FEATURE_KEY}]: Switch accounts`),
	setAccountConnectionLoading: createAction(
		`[${BRIDGE_FEATURE_KEY}]: Set account connection loading`,
		props<{ accountConnectionLoading: boolean }>()
	),
	getGbmAccount: createAction(`[${BRIDGE_FEATURE_KEY}]: Get GBM account`),
	getSecondaryAccount: createAction(`[${BRIDGE_FEATURE_KEY}]: Get secondary account`, props<{ id: AccountIDs }>()),
	selectAccount: createAction(`[${BRIDGE_FEATURE_KEY}]: Select account`, props<{ account: IAccount }>()),
	updateAccount: createAction(
		`[${BRIDGE_FEATURE_KEY}]: Update account`,
		props<{ id: string; update: Partial<IAccount> }>()
	),
	loading: createAction(`[${BRIDGE_FEATURE_KEY}]: Page loading`, props<{ loading: boolean }>()),
	reset: createAction(`[${BRIDGE_FEATURE_KEY}]: Reset form state`),
	setLog: createAction(`[${BRIDGE_FEATURE_KEY}]: Set operational logs`, props<{ message: string }>()),
	getLog: createAction(`[${BRIDGE_FEATURE_KEY}]: Get operational logs`, props<{ id: string }>()),
	disableForm: createAction(
		`[${BRIDGE_FEATURE_KEY}]: Disable form and form buttons`,
		props<{ disableForm: boolean }>()
	),
	setSubmitState: createAction(
		`[${BRIDGE_FEATURE_KEY}]: Set submit button state`,
		props<{ submitState?: ISubmitState }>()
	),
	setXDR: createAction(`[${BRIDGE_FEATURE_KEY}]: Set XDR`, props<{ xdr: string }>()),
	setTransactionHash: createAction(`[${BRIDGE_FEATURE_KEY}]: Set Transaction Hash`, props<{ transactionHash: string }>())
};
