// App
export const DEFAULT_DOCUMENT_TITLE = 'Bank of Memories';
export const DEFAULT_DOCUMENT_TITLE_HOME = 'Bridge - Bank of Memories';

export const RoutesCatalog = [{ url: '/', title: 'Bridge' }];

export const RoutesWithoutHeaderCatalog = ['/auth'];

export const toCamelCase = (value: string): string =>
	value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

export const toCapitalCase = (value: string): string =>
	value.toLowerCase().replace(/\w/, firstLetter => firstLetter.toUpperCase());
