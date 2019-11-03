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
		this.envConfig = ConfigService.validateInput(config);
	}

	private static validateInput(envConfig: EnvConfig): EnvConfig {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NODE_ENV: Joi.string()
				.valid('dev', 'production', 'test', 'integration')
				.default('dev'),
			PORT: Joi.number().default(3000),
			CORS_ORIGIN: Joi.string().default(true),
			AUTH_SALT_ROUNDS: Joi.number().required(),
			AUTH_PRIVATE_KEY: Joi.string().required(),
			AUTH_JWT_DURATION: Joi.number().default(3600),
			DB_HOST: Joi.string().required(),
			DB_PORT: Joi.number().default(3306),
			DB_USERNAME: Joi.string().required(),
			DB_PASSWORD: Joi.string().required(),
			DB_DATABASE: Joi.string().required(),
			DB_LOGGING: Joi.boolean().default(false),
			DB_ENTITY_PREFIX: Joi.string().default(''),
			DB_DROP_SCHEMA: Joi.boolean().default(false),
			DB_SYNC: Joi.boolean().default(false),
			VERSION: Joi.string().required(),
		});

		const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
		if (error) {
			throw new Error(`Config validation error: ${error.message}`);
		}
		return validatedEnvConfig;
	}

	public get dbConfig(): DbConfig {
		return {
			host: this.envConfig.DB_HOST,
			port: Number(this.envConfig.DB_PORT),
			username: this.envConfig.DB_USERNAME,
			password: this.envConfig.DB_PASSWORD,
			database: this.envConfig.DB_DATABASE,
			logging: Boolean(this.envConfig.DB_LOGGING),
			entityPrefix: this.envConfig.DB_ENTITY_PREFIX,
			dropSchema: Boolean(this.envConfig.DB_DROP_SCHEMA),
			synchronize: Boolean(this.envConfig.DB_SYNC),
		};
	}

	public get authConfig(): AuthConfig {
		return {
			privkey: this.envConfig.AUTH_PRIVATE_KEY,
			jwtDuration: Number(this.envConfig.AUTH_JWT_DURATION),
		};
	}

	public get cryptoConfig(): { saltRounds: number } {
		return { saltRounds: Number(this.envConfig.AUTH_SALT_ROUNDS) };
	}

	public get appConfig(): { port: number, corsOrigin: string | true } {
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
