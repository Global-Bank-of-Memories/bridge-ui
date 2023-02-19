import { BRIDGE_FEATURE_KEY } from './bridge.actions';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { IBridgeState } from './bridge.reducers';
import { ILog } from '../components/bridge-logger/bridge-logger.model';
import { IAccount } from '../interfaces/account.interfaces';
import { AccountIDs } from '@bridge/enums/account.enum';

export const bridgeSelector = (state: any): IBridgeState => state[BRIDGE_FEATURE_KEY];

export const BridgeSelectors = {
	selectModuleInitialized: createSelector(bridgeSelector, (state: IBridgeState) => state.initialized),
	selectSubmitState: createSelector(bridgeSelector, (state: IBridgeState) => state.submitState),
	selectLoading: createSelector(bridgeSelector, (state: IBridgeState) => state.loading),
	selectDisableForm: createSelector(bridgeSelector, (state: IBridgeState) => state.disableForm),
	selectAccounts: createSelector(bridgeSelector, (state: IBridgeState) => state.accounts),
	secondaryAccounts: createSelector(bridgeSelector, (state: IBridgeState) =>
		state.accounts.filter(account => account.id !== AccountIDs.GBM)
	),
	selectAccount: (id: string): MemoizedSelector<any, IAccount, DefaultProjectorFn<IAccount>> =>
		createSelector(bridgeSelector, (state: IBridgeState) => state.accounts.find(account => account.id === id)),
	primaryAccount: createSelector(bridgeSelector, (state: IBridgeState) =>
		state.accounts.find(account => account.id === AccountIDs.GBM)
	),
	selectedAccount: createSelector(bridgeSelector, (state: IBridgeState) =>
		state.accounts.find(account => account.id !== AccountIDs.GBM && account.selected)
	),
	operationalAccounts: createSelector(bridgeSelector, (state: IBridgeState) =>
		state.accounts.filter(account => account.selected)
	),
	selectAccountConnectionLoading: createSelector(
		bridgeSelector,
		(state: IBridgeState) => state.accountConnectionLoading
	),
	selectLogs: createSelector(bridgeSelector, (state: IBridgeState) => state.logs),
	selectLog: createSelector(bridgeSelector, (state: IBridgeState) => {
		const id = state.accounts
			.filter(account => account.selected)
			.sort((a, b) => Number(b.from) - Number(a.from))
			.map(account => account.id)
			.join('_');
		return state.logs.find(log => log.id === id) || null;
	}),
	selectBridgeConstants: createSelector(bridgeSelector, (state: IBridgeState) => state.constants.bridge),
	selectStellarConstants: createSelector(bridgeSelector, (state: IBridgeState) => state.constants.stellar),
	selectPolygonConstants: createSelector(bridgeSelector, (state: IBridgeState) => state.constants.polygon),
	selectConcordiumConstants: createSelector(bridgeSelector, (state: IBridgeState) => state.constants.concordium),
	selectXDR: createSelector(bridgeSelector, (state: IBridgeState) => state.xdr),
	selectTransactionHash: createSelector(bridgeSelector, (state: IBridgeState) => state.transactionHash),
};
