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

export interface ErrorResponse {
	msg: string;
	code: number;
	param: string;
}

export interface LoginDataResponse {
	token: string;
	retry: string;
}

export interface LoginResponse {
	result: boolean;
	error: ErrorResponse;
	data: LoginDataResponse;
}
