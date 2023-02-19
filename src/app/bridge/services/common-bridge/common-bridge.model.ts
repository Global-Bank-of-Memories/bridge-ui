export interface IBridgeConstantsResponse {
	data: IBridgeConstantsData;
}

export interface IBridgeConstantsData {
	bridge_urls: string[];
}

export interface IStellarConstantsResponse {
	data: IStellarConstantsData;
}

export interface IStellarConstantsData {
	bridge_account: string;
	server_url: string;
	network_passphrase: string;
}

export interface IPolygonConstantsResponse {
	data: IPolygonConstantsData;
}

export interface IPolygonConstantsData {
	bridge_account: string;
	token_account: string;
	abi_bridge: any;
	abi_token: any;
}

export interface IConcordiumConstantsResponse {
	data: IConcordiumConstantsData;
}

export interface IConcordiumConstantsData {
	contract_bridge: {
		contract_name: string;
		address: {
			contract_index: string;
			contract_sub_index: string;
		};
		raw_schema: string;
	};
	contract_token: {
		contract_name: string;
		address: {
			contract_index: string;
			contract_sub_index: string;
		};
		raw_schema: string;
	};
}

