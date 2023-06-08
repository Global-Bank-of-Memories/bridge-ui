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
import {AccountAddress, deserializeReceiveReturnValue} from '@concordium/web-sdk';

@Injectable({
	providedIn: 'root',
})
export class StakingService {
	private concordiumClient: WalletApi;
	private wgbmContractName = 'wGBM';
	private wgbmContractAddress: ContractAddress = {
		index: 2928n,
		subindex: 0n
	};
	private stakingContractAddress: ContractAddress = {
		index: 4768n,
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

	public async isOperatorOf(wallet: string): Promise<any> {
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
			params,
			new AccountAddress(wallet)
		);

		const returnValues = deserializeReceiveReturnValue(
			result,
			WGBM_CONTRACT_INFO.schemaBuffer,
			this.wgbmContractName,
			isOperatorOfMethod,
			0,
		);
		return returnValues;
	}

	public async stake(amount: number, wallet: string): Promise<void> {
		const method = 'stake';

		const parameters = {
			amount: amount * 10000000,
			pool_id: this.poolId,
			owned_entrypoint_name: ''
		};
		const isOperator = await this.isOperatorOf(wallet);
		if (!isOperator || !isOperator[0]) {
			await this.updateOperator(wallet);
		}

		await this.concordiumCommonService.updateContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			parameters,
			wallet,
			this.stakingContractAddress,
			method,
			BigInt(99999),
		);
	}

	public async unstake(wallet: string): Promise<void> {
		const method = 'unstake';
		const parameters = {
			pool_id: this.poolId,
			owned_entrypoint_name: ''
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
			pool_id: this.poolId,
			owned_entrypoint_name: ''
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

	public async getPoolStaking(wallet: string): Promise<any> {
		const method = 'getPoolStaking';
		const params = {
			pool_id: this.poolId
		};

		const result = await this.concordiumCommonService.invokeContract(
			this.concordiumClient,
			STAKING_CONTRACT_INFO,
			this.stakingContractAddress,
			method,
			params,
			new AccountAddress(wallet)
		);

		const returnValues = deserializeReceiveReturnValue(
			result,
			STAKING_CONTRACT_INFO.schemaBuffer,
			STAKING_CONTRACT_INFO.contractName,
			method,
			0,
		);

		return returnValues;
	}
}
