import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToastService } from '@shared/components/toast/toast.service';
import { IMetamaskAssetsResponse } from './metamask.model';
import { BridgeDataService } from '@bridge/services/bridge-data.service';

@Injectable({
	providedIn: 'root'
})
export class MetamaskService {
	public ethereum = (window as any).ethereum;

	constructor(public toastService: ToastService, private bridgeDataService: BridgeDataService) {}

	public getMetamaskAccount(): Observable<string> {
		return from(this.ethereum.request({ method: 'eth_requestAccounts' })).pipe(
			map((account: string[]) => account[0]),
			catchError(error => {
				this.bridgeDataService.setAccountConnectionLoading(false);
				this.toastService.addAlertDanger({
					header: 'Metamask Gateway',
					body: _.get(error, 'message', 'Unknown metamask error')
				});

				return error;
			})
		) as Observable<string>;
	}

	public getContract(abi: any, contractAddress: string): any {
		const web3Instance = new (window as any).Web3((window as any).Web3.givenProvider);
		return new web3Instance.eth.Contract(JSON.parse(JSON.stringify(abi)), contractAddress);
	}

	public getWeb3Instance(): any {
		return (window as any).Web3((window as any).Web3.givenProvider);
	}

	public handleAssets(): Observable<IMetamaskAssetsResponse> {
		return from(
			this.ethereum.request({
				method: 'wallet_watchAsset',
				params: {
					type: 'ERC20',
					options: {
						address: 'TOKEN_ADDRESS',
						symbol: 'wGBM',
						decimals: 7,
						image: 'https://api.bankofmemories.org/static/gbm-coin-icon.png'
					}
				}
			})
		).pipe(
			filter(Boolean),
			catchError(error => {
				this.toastService.addAlertDanger({
					header: 'Requesting Assets Failed',
					body: _.get(error, 'message', 'Unknown gateway error')
				});

				return error;
			})
		) as Observable<IMetamaskAssetsResponse>;
	}
}
