import { Injectable } from '@angular/core';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { WalletApi } from '@concordium/browser-wallet-api-helpers/lib/wallet-api-types';
import {
	ContractAddress
} from '@concordium/common-sdk/lib/types';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment } from '@environments/environment';
import {IFundLevel} from '@home/services/concordium/fund-level.interface';
import {map} from 'rxjs/operators';
import {ConcordiumCommonService} from '@shared/services/concordium/concordium-common.service';
import {STAKING_CONTRACT_INFO, WGBM_CONTRACT_INFO} from '@shared/models/constants';

@Injectable({
	providedIn: 'root',
})
export class StakingService {
	private concordiumClient: WalletApi;
	private contractName = 'gbm_Staking';
	private wgbmContractName = 'wGBM';
	private wgbmContractAddress: ContractAddress = {
		index: 2928n,
		subindex: 0n
	};
	private stakingContractAddress: ContractAddress = {
		index: 3921n,
		subindex: 0n
	};
	poolId = 0;

	constructor(
		private httpClient: HttpClient,
		private concordiumCommonService: ConcordiumCommonService
	) {
	}

	public async getConcordiumProvider(): Promise<void> {
		this.concordiumClient = await detectConcordiumProvider();
	}

	getStakingLevel(): Observable<IFundLevel> {
		return this.httpClient.get(`${environment.gbmApiUrl}/staking/fund-level`)
			.pipe(map((res: any) => res.data));
	}

	public async updateOperator(wallet: string): Promise<void> {
		const updateOperatorMethod = 'updateOperator';
		const params = [{
			update: {Add: {}},
			operator: {
				Contract: [{
					index: parseInt(this.stakingContractAddress.index.toString(), 10),
					subindex: parseInt(this.stakingContractAddress.subindex.toString(), 10)
				}]
			}
		}];

		await this.concordiumCommonService.updateContract(
			this.concordiumClient,
			WGBM_CONTRACT_INFO,
			params,
			wallet,
			this.wgbmContractAddress,
			updateOperatorMethod
		);
	}

	public async isOperatorOf(wallet: string): Promise<void> {
		const isOperatorOfMethod = 'operatorOf';
		const params = [
			{
				owner: {
					Account: [wallet],
				},
				address: {
					Contract: [{
						index: parseInt(this.stakingContractAddress.index.toString(), 10),
						subindex: parseInt(this.stakingContractAddress.subindex.toString(), 10)
					}]
				},
			}];
		const result = await this.concordiumCommonService.invokeContract(
			this.concordiumClient,
			WGBM_CONTRACT_INFO,
			this.wgbmContractAddress,
			isOperatorOfMethod,
			params
		);
	}

	public async stake(amount: number, wallet: string): Promise<void> {
		const method = 'stake';

		const parameters = {
			amount,
			pool_id: 0,
			owned_entry_point: ''
		};

		await this.updateOperator(wallet);

		const result = await this.concordiumCommonService.updateContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			parameters,
			wallet,
			this.stakingContractAddress,
			method
		);
	}

	public async unstake(wallet: string): Promise<void> {
		const method = 'unstake';
		const parameters = {
			pool_id: 0,
			owned_entry_point: ''
		};

		const result = await this.concordiumCommonService.updateContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			parameters,
			wallet,
			this.stakingContractAddress,
			method
		);
	}

	public async harvestRewards(wallet: string): Promise<void> {
		const method = 'harvestRewards';
		const parameters = {
			pool_id: 0,
			owned_entry_point: ''
		};

		const result = await this.concordiumCommonService.updateContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			parameters,
			wallet,
			this.stakingContractAddress,
			method
		);
	}

	public async getPoolStaking(wallet: string): Promise<void> {
		const method = 'getPoolStaking';
		const params = {
			pool_id: this.poolId
		};

		const result = await this.concordiumCommonService.invokeContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			this.stakingContractAddress,
			method,
			params
		);
	}
}
