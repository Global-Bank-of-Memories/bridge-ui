export interface Nav {
	key: string;
	title: string;
	links: {
		name: string;
		url?: string;
		children?: {
			name: string;
			url: string;
		}[];
	}[];
}
