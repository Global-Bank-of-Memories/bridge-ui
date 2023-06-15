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
	contractName: 'wgbm_token',
	schemaBuffer: Buffer.from(WGBM_CONTRACT_RAW_SCHEMA, 'base64'),
	moduleRef: new ModuleReference(WGB_CONTRACT_MODULE_REF),
};

export const STAKING_CONTRACT_INFO: ContractInfo = {
	contractName: 'wgbm_staking1',
	schemaBuffer: Buffer.from(STAKING_CONTRACT_RAW_SCHEMA, 'base64'),
	moduleRef: new ModuleReference(STAKING_CONTRACT_MODULE_REF),
};
