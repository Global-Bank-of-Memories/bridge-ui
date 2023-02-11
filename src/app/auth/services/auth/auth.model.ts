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

export interface OTPDataRetryResponse {
	retry: string;
}

export interface OTPRetryResponse {
	result: boolean;
	error: ErrorResponse;
	data: OTPDataRetryResponse;
}

export interface OTPWalletResponse {
	public_key: string;
	balance: number;
}
export interface OTPResponse {
	result: boolean;
	error: ErrorResponse;
	data: {
		access_token: string;
		refresh_token: string;
		wallet: OTPWalletResponse;
		keychain: string;
	};
}
