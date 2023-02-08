export enum BridgeNetworks {
	GBM = 'GBM',
	POLYGON = 'Polygon'
}

export const CurrencyGBMData = {
	title: BridgeNetworks.GBM,
	label: BridgeNetworks.GBM,
	wallet: 'metamask',
	icon: 'eth'
};

export const CurrencyPolygonData = {
	title: BridgeNetworks.POLYGON,
	label: 'WGBM',
	wallet: BridgeNetworks.POLYGON,
	icon: 'matic'
};

export const Networks = [CurrencyPolygonData];
