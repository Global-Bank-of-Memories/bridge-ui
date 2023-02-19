import { Injectable } from '@angular/core';
import { AccountIDs } from '@bridge/enums/account.enum';
import { IAccount } from '@bridge/interfaces/account.interfaces';
import { BridgeSelectors } from '@bridge/state/bridge.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISubmitState } from '../components/bridge-form/bridge-form.model';
import { ILog, LoggerColor, LoggerType } from '../components/bridge-logger/bridge-logger.model';
import { BridgeActions, BRIDGE_FEATURE_KEY } from '../state/bridge.actions';
import { IBridgeState } from '../state/bridge.reducers';
import {
	IBridgeConstantsData,
	IConcordiumConstantsData,
	IPolygonConstantsData,
	IStellarConstantsData
} from './common-bridge/common-bridge.model';

@Injectable({
	providedIn: 'root'
})
export class BridgeDataService {
	public primaryAccount$: Observable<IAccount> = this.store.select(BridgeSelectors.primaryAccount);
	public selectedAccount$: Observable<IAccount> = this.store.select(BridgeSelectors.selectedAccount);
	public secondaryAccounts$: Observable<IAccount[]> = this.store.select(BridgeSelectors.secondaryAccounts);
	public operationalAccounts$: Observable<IAccount[]> = this.store.select(BridgeSelectors.operationalAccounts);
	public log$: Observable<ILog> = this.store.select(BridgeSelectors.selectLog);
	public accountConnectionLoading$: Observable<boolean> = this.store.select(BridgeSelectors.selectAccountConnectionLoading);
	public xdr$: Observable<string> = this.store.select(BridgeSelectors.selectXDR);
	public transactionHash$: Observable<string> = this.store.select(BridgeSelectors.selectTransactionHash);
	public submitState$: Observable<ISubmitState> = this.store.select(BridgeSelectors.selectSubmitState);

	public getBridgeConstants$: Observable<IBridgeConstantsData> = this.store.select(BridgeSelectors.selectBridgeConstants);
	public stellarConstants$: Observable<IStellarConstantsData> = this.store.select(
		BridgeSelectors.selectStellarConstants
	);
	public getPolygonConstants$: Observable<IPolygonConstantsData> = this.store.select(
		BridgeSelectors.selectPolygonConstants
	);
	public getConcordiumConstants$: Observable<IConcordiumConstantsData> = this.store.select(
		BridgeSelectors.selectConcordiumConstants
	);

	constructor(private store: Store<{ [BRIDGE_FEATURE_KEY]: IBridgeState }>) {}

	public initModule(): void {
		this.store.dispatch(BridgeActions.init());
	}

	public selectAccount(account: IAccount): void {
		this.store.dispatch(BridgeActions.selectAccount({ account }));
	}

	public switchAccounts(): void {
		this.store.dispatch(BridgeActions.switchAccounts());
	}

	public setAccountData(id: AccountIDs): void {
		this.store.dispatch(BridgeActions.getSecondaryAccount({ id }));
	}

	public setAccountConnectionLoading(accountConnectionLoading: boolean): void {
		this.store.dispatch(BridgeActions.setAccountConnectionLoading({ accountConnectionLoading }));
	}

	public setXDR(xdr: string): void {
		this.store.dispatch(BridgeActions.setXDR({ xdr }));
	}

	public setTransactionHash(transactionHash: string): void {
		this.store.dispatch(BridgeActions.setTransactionHash({ transactionHash }));
	}

	public setSubmitState(submitState: ISubmitState): void {
		this.store.dispatch(BridgeActions.setSubmitState({ submitState }));
	}

	public disableForm(disable = true): void {
		this.store.dispatch(BridgeActions.disableForm({ disableForm: disable }));
	}

	public setLog(logMessage: string, type: LoggerType = LoggerType.DEFAULT): void {
		const loggerContainer = document.querySelector('#logger-container');
		const cssClass = LoggerColor[type];
		const message = `<p class="${cssClass}">> ${new Date().toLocaleTimeString()}: ${logMessage}</p>`;

		if (loggerContainer) {
			setTimeout(() => loggerContainer.scroll({ behavior: 'smooth', top: loggerContainer.scrollHeight }));
		}

		this.store.dispatch(BridgeActions.setLog({ message }));
	}
}
