import { Buffer } from 'buffer/';
import { ModuleReference } from '@concordium/web-sdk';
import { ContractInfo } from '@shared/services/concordium/concordium-common.service';
import {
	STAKING_CONTRACT_MODULE_REF,
	STAKING_CONTRACT_RAW_SCHEMA,
	WGB_CONTRACT_MODULE_REF,
	WGBM_CONTRACT_RAW_SCHEMA
} from '@shared/models/concordium.model';


export const WGBM_CONTRACT_INFO: ContractInfo = {
	contractName: 'wGBM',
	schemaBuffer: Buffer.from(WGBM_CONTRACT_RAW_SCHEMA, 'base64'),
	moduleRef: new ModuleReference(WGB_CONTRACT_MODULE_REF),
};

export const STAKING_CONTRACT_INFO: ContractInfo = {
	contractName: 'gbm_Staking',
	schemaBuffer: Buffer.from(STAKING_CONTRACT_RAW_SCHEMA, 'base64'),
	moduleRef: new ModuleReference(STAKING_CONTRACT_MODULE_REF),
};

export const CONNCORDIUM_NODE_ENDPOINT = "https://grpc.testnet.concordium.com";
export const CONCORDIUM_NODE_PORT = 20000;
