export interface AuthConfig {
	privkey: string;
	jwtDuration: number;
}

export interface DbConfig {
	uri: string;
	user: string;
	pass: string;
	autoIndex: boolean;
	family: 4 | 6;
}
