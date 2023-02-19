import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BridgeActions } from './bridge.actions';
import { concat, Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { BRIDGE_FEATURE_KEY } from './bridge.actions';
import { IBridgeState } from './bridge.reducers';
import { bridgeSelector } from './bridge.selectors';
import { Accounts } from '../constants/account.constants';
import { GbmService } from '@bridge/services/gbm/gbm.service';
import { AccountIDs } from '@bridge/enums/account.enum';
import { CommonBridgeService } from '@bridge/services/common-bridge/common-bridge.service';
import { PolygonService } from '@bridge/services/polygon/polygon.service';
import { ConcordiumService } from '@bridge/services/concordium/concordium.service';
import { BridgeDataService } from '@bridge/services/bridge-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerType } from '@bridge/components/bridge-logger/bridge-logger.model';
import { LoggerDictionary } from '@bridge/components/bridge-logger/bridge-logger.dictionary';

@Injectable()
export class BridgeEffects {
	public state$: Observable<IBridgeState> = this.store.select(bridgeSelector);

	public initializeModule$ = createEffect(() =>
		this.actions$.pipe(
			ofType(BridgeActions.init),
			switchMap(() => [
				BridgeActions.setAccounts({ accounts: Accounts }),
				BridgeActions.setSubmitState({}),
				BridgeActions.getGbmAccount(),
				BridgeActions.getBridgeConstants()
			])
		)
	);

	public setGbmAccount$ = createEffect(() =>
		this.actions$.pipe(
			ofType(BridgeActions.getGbmAccount),
			switchMap(() =>
				this.gbmService
					.getAccount()
					.pipe(map(response => BridgeActions.updateAccount({ id: AccountIDs.GBM, update: response })))
			)
		)
	);

	public setPolygonAccount$ = createEffect(() =>
		this.actions$.pipe(
			ofType(BridgeActions.getSecondaryAccount),
			switchMap(props => {
				if (props.id === AccountIDs.POLYGON) {
					console.log(props);
					return this.polygonSevice
						.getAccount()
						.pipe(map(response => BridgeActions.updateAccount({ id: AccountIDs.POLYGON, update: response })));
				}

				if (props.id === AccountIDs.CONCORDIUM) {
					return this.concordiumService
						.getAccount()
						.pipe(map(response => BridgeActions.updateAccount({ id: AccountIDs.CONCORDIUM, update: response })));
				}

				return null;
			})
		)
	);

	public setBridgeConstants$ = createEffect(() =>
		this.actions$.pipe(
			ofType(BridgeActions.getBridgeConstants),
			switchMap(() =>
				concat(
					this.commonBridgeService
						.getBridgeConstants()
						.pipe(map(response => BridgeActions.setBridgeConstants({ constant: { bridge: response } }))),
					this.commonBridgeService
						.getStellarConstants()
						.pipe(map(response => BridgeActions.setBridgeConstants({ constant: { stellar: response } }))),
					this.commonBridgeService
						.getPolygonConstants()
						.pipe(map(response => BridgeActions.setBridgeConstants({ constant: { polygon: response } }))),
					this.commonBridgeService
						.getConcordiumConstants()
						.pipe(map(response => BridgeActions.setBridgeConstants({ constant: { concordium: response } })))
				)
			)
		)
	);

	constructor(
		private store: Store<{ [BRIDGE_FEATURE_KEY]: IBridgeState }>,
		private actions$: Actions,
		private gbmService: GbmService,
		private polygonSevice: PolygonService,
		private concordiumService: ConcordiumService,
		private commonBridgeService: CommonBridgeService,
		private bridgeDataService: BridgeDataService
	) {}
}
