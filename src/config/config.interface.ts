export interface AuthConfig {
	privkey: string;
	jwtDuration: number;
}

export interface DbConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	logging: boolean;
	entityPrefix: string;
	dropSchema: boolean;
	synchronize: boolean;
}
