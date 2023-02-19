/* eslint-disable prettier/prettier */
import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '@environments/environment';

export interface IRootState {
	router: fromRouter.RouterReducerState<any>;
	[featureKey: string]: any;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<IRootState, Action>>('Root state token', {
	factory: (): any => ({
		router: fromRouter.routerReducer
	})
});

export const logger =
	(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> =>
		(previousState, action): IRootState => {
			const nextState = reducer(previousState, action);
			console.groupCollapsed(action.type);
		  console.log({ previousState, action, nextState });
			console.groupEnd();
			return nextState;
		};

export const metaReducers: MetaReducer<IRootState>[] = !environment.production ? [] : [];
