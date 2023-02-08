export interface GbmGoogleAnalyticsEventConfig {
	actionName: GbmGoogleAnalyticsEvents;
	category: string;
	isExternalNavigate: boolean;
	label?: string;
	value?: number;
}

export interface GbmPurchaseModel {
	merchantTitle: string;
	currencyTitle: string;
	gbmCoins: number;
	isMobile: boolean;
	isPromocode: boolean;
}

export enum GbmGoogleAnalyticsCategories {
	PERFOMANCE_METRICS = 'performance_metrics',
	BUTTON_CLICK = 'button_click'
}

export enum GbmGoogleAnalyticsEvents {
	EXTERNAL_NAVIGATE = 'external_navigate',
	INTERNAL_NAVIGATE = 'internal_navigate',
	HTTP_ERROR = 'gateway_error',
	HTTP_PENDING = 'slow_connection',
	BUTTON_CLICK = 'button_click'
}
