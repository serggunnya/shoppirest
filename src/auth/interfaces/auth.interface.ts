export interface IToken {
	access_token: string;
}

export interface IJwtTokens extends IToken {
	refresh_token: string;
}

export interface IUserCredentials {
	email: string;
	password: string;
}

export interface IUserDto extends IUserCredentials {
	firstname: string;
	lastname: string;
}
