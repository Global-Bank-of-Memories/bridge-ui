export interface GbmRequestApis {
	name: string;
	url: string;
	delay: number;
	message: {
		header: string;
		body: string;
	};
}
