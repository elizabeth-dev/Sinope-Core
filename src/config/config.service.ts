import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AuthConfig, DbConfig } from './config.interface';

export interface EnvConfig {
	[key: string]: string;
}

@Injectable()
export class ConfigService {
	private readonly envConfig: EnvConfig;

	constructor(filePath: string) {
		const config = dotenv.parse(fs.readFileSync(filePath));
		this.envConfig = ConfigService.validateInput({
			...process.env,
			...config,
		});
	}

	private static validateInput(envConfig: EnvConfig): EnvConfig {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NODE_ENV: Joi.string().valid('dev', 'production', 'test', 'integration').default('dev'),
			PORT: Joi.number().default(3000),
			CORS_ORIGIN: Joi.string().default(true),
			AUTH_SALT_ROUNDS: Joi.number().required(),
			AUTH_PRIVATE_KEY: Joi.string().required(),
			AUTH_JWT_DURATION: Joi.number().default(3600),
			DB_URI: Joi.string().required(),
			DB_USERNAME: Joi.string().required().allow(''),
			DB_PASSWORD: Joi.string().required().allow(''),
			DB_AUTOINDEX: Joi.boolean().default(true),
			DB_IPFAMILY: Joi.number().valid(4, 6).default(4),
			VERSION: Joi.string().required(),
		})
			.unknown()
			.options({ stripUnknown: true });

		const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
		if (error) {
			throw new Error(`Config validation error: ${error.message}`);
		}
		return validatedEnvConfig;
	}

	public get dbConfig(): DbConfig {
		return {
			uri: this.envConfig.DB_URI,
			user: this.envConfig.DB_USERNAME,
			pass: this.envConfig.DB_PASSWORD,
			autoIndex: Boolean(this.envConfig.DB_AUTOINDEX),
			family: Number(this.envConfig.DB_IPFAMILY) as 4 | 6,
		};
	}

	public get authConfig(): AuthConfig {
		return {
			privkey: this.envConfig.AUTH_PRIVATE_KEY,
			accessTokenDuration: Number(this.envConfig.AUTH_JWT_DURATION),
		};
	}

	public get cryptoConfig(): { saltRounds: number } {
		return { saltRounds: Number(this.envConfig.AUTH_SALT_ROUNDS) };
	}

	public get appConfig(): { port: number; corsOrigin: string | true } {
		return {
			port: Number(this.envConfig.PORT),
			corsOrigin: this.envConfig.CORS_ORIGIN,
		};
	}

	public get metaConfig(): { version: string } {
		return {
			version: this.envConfig.VERSION,
		};
	}

	public get(key: string): string {
		return this.envConfig[key];
	}
}
