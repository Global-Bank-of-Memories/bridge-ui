import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { WalletApi } from '@concordium/browser-wallet-api-helpers/lib/wallet-api-types';
import {
	AccountTransactionType,
	ContractAddress,
	TransactionStatusEnum,
	TransactionSummary
} from '@concordium/common-sdk/lib/types';
import {CcdAmount} from '@concordium/common-sdk/lib/types/ccdAmount';
import {
	BRIDGE_CONTRACT_RAW_SCHEMA,
	STAKING_CONTRACT_RAW_SCHEMA,
	WGBM_CONTRACT_RAW_SCHEMA
} from '@home/services/concordium/concordium.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment } from '@environments/environment';
import {IFundLevel} from '@home/services/concordium/fund-level.interface';
import {map} from 'rxjs/operators';
import {LOGGER_TYPES, WalletBaseService} from '@home/services/wallet-base';
import {ConcordiumCommonService} from '@home/services/concordium/concordium-common.service';
import {BigInteger} from '@angular/compiler/src/i18n/big_integer';

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

	public async stake(wallet: string): Promise<void> {
		const method = 'stake';
		const updateOperatorMethod = 'updateOperator';
		const isOperatorOfMethod = 'isOperatorOf';
    const amount = 1;
		const parameters = {
			amount,
			pool_id: 0,
			owned_entry_point: ''
		};

		const parameters2 = [{
			update: {Add: {}},
			operator: {
				Contract: [{
					index: parseInt(this.stakingContractAddress.index.toString(), 10),
					subindex: parseInt(this.stakingContractAddress.subindex.toString(), 10)
				}]
			}
		}];
    const instanceIfoWgbm = await this.concordiumCommonService.getInstanceInfo(this.concordiumClient, this.wgbmContractAddress);
    console.log('instanceIfoWgbm', instanceIfoWgbm);
		console.log('hello');
    const instanceIfo = await this.concordiumCommonService.getInstanceInfo(this.concordiumClient, this.stakingContractAddress);
    console.log('instanceIfo', instanceIfo);
		// const updateOperatorTxnHash = await this.concordiumClient.sendTransaction(
		// 	wallet,
		// 	AccountTransactionType.Update,
		// 	{
		// 		amount: new CcdAmount(0n),
		// 		address: this.wgbmContractAddress,
		// 		receiveName: `${this.wgbmContractName}.${updateOperatorMethod}`,
		// 		maxContractExecutionEnergy: 100000n
		// 	},
		// 	parameters2 as any,
		// 	WGBM_CONTRACT_RAW_SCHEMA,
		// 	0
		// );
		// let outcomes = await this.waitForTransaction(this.concordiumClient, updateOperatorTxnHash);
		// outcomes = this.ensureValidOutcome(outcomes);
		// console.log(outcomes);
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

		// const retValue = this.concordiumCommonService.invokeContract(
		// 	this.concordiumClient,
		//   {} as any,
		//   this.wgbmContractAddress,
		//   isOperatorOfMethod,
		// 	params as any,
		// );

		// console.log(retValue);
		const stakeTxnHash = await this.concordiumClient.sendTransaction(
			wallet,
			AccountTransactionType.Update,
			{
				amount: new CcdAmount(0n),
				address: this.stakingContractAddress,
				receiveName: `${this.contractName}.${method}`,
				maxContractExecutionEnergy: 100000n
			},
			parameters as any,
			STAKING_CONTRACT_RAW_SCHEMA,
			0
		);

		let outcomes = await this.waitForTransaction(this.concordiumClient, stakeTxnHash);
		outcomes = this.ensureValidOutcome(outcomes);
		console.log(outcomes);
		console.log('stake');
	}

	public async unstake(wallet: string): Promise<void> {}

	public async harvestRewards(wallet: string): Promise<void> {}

	async getPoolStaking(wallet: string): Promise<void> {
		const method = 'getPoolStaking';
		const parameters = {
			pool_id: this.poolId
		};
		const result = await this.concordiumClient.getJsonRpcClient().invokeContract({
			contract: this.stakingContractAddress,
			method
		}).then(res => {
			console.log('res', res);
		});
		console.log(result);
		// const result = await this.concordiumClient.sendTransaction(
		// 	wallet,
		// 	AccountTransactionType.Update,
		// 	{
		// 		amount: new CcdAmount(0n),
		// 		address: this.stakingContractAddress,
		// 		receiveName: `${this.contractName}.${method}`,
		// 		maxContractExecutionEnergy: 100000n
		// 	},
		// 	parameters,
		// 	STAKING_CONTRACT_RAW_SCHEMA,
		// 	0
		// );
		console.log(result);
	}
	//
	// async stake(senderAddress: string, poolId: string, amount: BigNumber): Promise<void> {
	// 	await this.signAndSendContractInvocationUsingBrowserWallet(
	// 		senderAddress,
	// 		this.contractAddress,
	// 		'stake',
	// 		{ poolId, amount: amount.toString() }
	// 	);
	// }
	//
	// async unstake(senderAddress: string, poolId: string, amount: BigNumber): Promise<void> {
	// 	await this.signAndSendContractInvocationUsingBrowserWallet(
	// 		senderAddress,
	// 		this.contractAddress,
	// 		'unstake',
	// 		{ poolId, amount: amount.toString() }
	// 	);
	// }
	//
	// async harvestRewards(senderAddress: string, poolId: string): Promise<void> {
	// 	await this.signAndSendContractInvocationUsingBrowserWallet(
	// 		senderAddress,
	// 		this.contractAddress,
	// 		'harvestRewards',
	// 		{ poolId }
	// 	);
	// }
	//
	// async signAndSendContractInvocationUsingBrowserWallet(
	// 	senderAddress: string,
	// 	contractAddress: string,
	// 	methodName: string,
	// 	parameters: any
	// ): Promise<void> {
	//   const provider = await detectConcordiumProvider();
	// 	// Prepare a contract invocation transaction
	// 	const transaction = this.concordiumClient.createContractInvocationTransaction(
	// 		senderAddress,
	// 		contractAddress,
	// 		methodName,
	// 		parameters,
	// 		new TransactionExpiry(new Date(Date.now() + 3600000))
	// 	);
	//
	// 	try {
	// 		// Create a sign transfer transaction request for the browser wallet
	// 		const signTransferTransactionRequest = createSignTransferTransactionRequest(transaction);
	//
	// 		// Send the sign transfer transaction request to the browser wallet
	// 		const signedTransaction = await provider.sendRequest(signTransferTransactionRequest);
	//
	// 		// Send the signed transaction to the Concordium node
	// 		const result = await sendTransaction(signedTransaction, this.concordiumNodeUrl);
	// 		console.log('Transaction result:', result);
	// 		return result;
	// 	} catch (error) {
	// 		console.error('Error sending transaction:', error);
	// 		throw error;
	// 	}
	// }

	/**
	 * Waits for the input transaction to Finalize.
	 *
	 * @param provider Wallet Provider.
	 * @param txnHash Hash of Transaction.
	 * @returns Transaction outcomes.
	 */
	async waitForTransaction(
		provider: WalletApi,
		txnHash: string
	): Promise<Record<string, TransactionSummary> | undefined> {
		return new Promise((res, rej) => {
			this.wait(provider, txnHash, res, rej);
		});
	}

	ensureValidOutcome(
		outcomes?: Record<string, TransactionSummary>
	): Record<string, TransactionSummary> {
		if (!outcomes) {
			throw Error('Null Outcome');
		}

		const successTxnSummary = Object.keys(outcomes)
			.map((k) => outcomes[k])
			.find((s) => s.result.outcome === 'success');

		if (!successTxnSummary) {
			const failures = Object.keys(outcomes)
				.map((k) => outcomes[k])
				.filter((s) => s.result.outcome === 'reject')
				.map((s) => (s.result as any).rejectReason.tag)
				.join(',');
			throw Error(`Transaction failed, reasons: ${failures}`);
		}

		return outcomes;
	}

	private wait(
		provider: WalletApi,
		txnHash: string,
		res: (p: Record<string, TransactionSummary> | undefined) => void,
		rej: (reason: any) => void
	): any {
		setTimeout(() => {
			provider
				.getJsonRpcClient()
				.getTransactionStatus(txnHash)
				.then((txnStatus) => {
					if (!txnStatus) {
						return rej('Transaction Status is null');
					}

					console.info(`txn : ${txnHash}, status: ${txnStatus?.status}`);
					if (txnStatus?.status === TransactionStatusEnum.Finalized) {
						return res(txnStatus.outcomes);
					}

					this.wait(provider, txnHash, res, rej);
				})
				.catch((err) => rej(err));
		}, 1000);
	}
}
