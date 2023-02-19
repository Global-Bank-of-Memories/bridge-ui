import * as _ from 'lodash';
import { Action, createReducer, on } from '@ngrx/store';
import { BridgeActions } from './bridge.actions';
import { IAccount } from '../interfaces/account.interfaces';
import {
	IBridgeConstantsData,
	IConcordiumConstantsData,
	IPolygonConstantsData,
	IStellarConstantsData
} from '@bridge/services/common-bridge/common-bridge.model';
import { ILog, LOG_LIMIT } from '../components/bridge-logger/bridge-logger.model';
import { ISubmitState, SubmitState } from '../components/bridge-form/bridge-form.model';

export interface IBridgeState {
	initialized: boolean;
	accounts: IAccount[];
	submitState: ISubmitState;
	loading: boolean;
	disableForm: boolean;
	constants: {
		bridge: IBridgeConstantsData | null;
		stellar: IStellarConstantsData | null;
		polygon: IPolygonConstantsData | null;
		concordium: IConcordiumConstantsData | null;
	};
	logs: ILog[];
	accountConnectionLoading: boolean;
	xdr: string;
	transactionHash: string;
}

export const bridgeInitialState: IBridgeState = {
	initialized: false,
	accounts: [],
	loading: false,
	disableForm: false,
	logs: [],
	constants: {
		bridge: null,
		stellar: null,
		polygon: null,
		concordium: null
	},
	submitState: {
		title: SubmitState.SEND_TRANSFER,
		loading: false
	},
	accountConnectionLoading: false,
	xdr: '',
	transactionHash: ''
};

const setLog = (state, message): ILog[] => {
	const logs = state.logs;

	const currentFlowId = state.accounts
		.filter(account => account.selected)
		.sort((a, b) => Number(b.from) - Number(a.from))
		.map(account => account.id)
		.join('_');

	if (_.isEmpty(logs)) {
		return [
			{
				id: currentFlowId,
				data: message,
				createdDate: new Date(),
				updatedDate: new Date()
			}
		];
	}

	const existedLog = logs.find(item => item.id === currentFlowId);

	return state.logs.map(log => {
		if (existedLog && log.id === existedLog.id) {
			return {
				...log,
				data: log.data.length < LOG_LIMIT ? log.data + message : message,
				updatedDate: Date.now()
			};
		}

		if (_.isEmpty(existedLog)) {
			return {
				id: currentFlowId,
				data: message,
				createdDate: Date.now(),
				updatedDate: Date.now()
			};
		}

		return log;
	});
};

const bridgeReducer = createReducer(
	bridgeInitialState,
	on(BridgeActions.init, state => ({
		...state,
		initialized: true
	})),
	on(BridgeActions.setAccounts, (state, { accounts }) => ({
		...state,
		accounts
	})),
	on(BridgeActions.selectAccount, (state, { account }) => ({
		...state,
		accounts: state.accounts.map(acc => {
			if (!acc.selected && acc.id === account?.id) {
				return {
					...acc,
					selected: true
				};
			}

			if (acc.selected && acc.id !== account?.id) {
				return {
					...acc,
					selected: false
				};
			}

			return acc;
		})
	})),
	on(BridgeActions.updateAccount, (state, { id, update }) => {
		if (id && update) {
			return {
				...state,
				accountConnectionLoading: false,
				accounts: state.accounts.map(acc => {
					if (acc.id === id) {
						return {
							...acc,
							...update
						};
					}

					return acc;
				})
			};
		}

		return state;
	}),
	on(BridgeActions.switchAccounts, state => ({
		...state,
		accounts: state.accounts.map(account => {
			if (account.selected) {
				return {
					...account,
					from: !account.from
				};
			}

			return account;
		})
	})),
	on(
		BridgeActions.setSubmitState,
		(
			state,
			{
				submitState = {
					title: SubmitState.SEND_TRANSFER,
					loading: false
				}
			}
		) => ({
			...state,
			submitState
		})
	),
	on(BridgeActions.loading, (state, { loading }) => ({
		...state,
		loading
	})),
	on(BridgeActions.disableForm, (state, { disableForm }) => ({
		...state,
		disableForm
	})),
	on(BridgeActions.setLog, (state, { message }) => ({
		...state,
		logs: setLog(state, message)
	})),
	on(BridgeActions.reset, state => ({
		...state,
		disableForm: false,
		loading: false,
		submitState: {
			title: SubmitState.SEND_TRANSFER,
			loading: false
		}
	})),
	on(BridgeActions.setBridgeConstants, (state, { constant }) => ({
		...state,
		constants: { ...state.constants, ...constant }
	})),
	on(BridgeActions.setAccountConnectionLoading, (state, { accountConnectionLoading }) => ({
		...state,
		accountConnectionLoading
	})),
	on(BridgeActions.setXDR, (state, { xdr }) => ({
		...state,
		xdr
	})),
	on(BridgeActions.setTransactionHash, (state, { transactionHash }) => ({
		...state,
		transactionHash
	}))
);

export const wrappedBridgeReducer = (state: IBridgeState, action: Action): any => bridgeReducer(state, action);
