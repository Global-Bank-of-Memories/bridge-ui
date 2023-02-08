export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';

export interface AccessTokenData {
	exp: number;
	firstName: string;
	iat: number;
	isAdmin: boolean;
	lastName: string;
	sub: string;
	username: string;
}

export interface LoginResponse {
	access_token: string;
}
