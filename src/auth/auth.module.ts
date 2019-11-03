import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '../config/config.service';

import { CryptoModule } from '../crypto/crypto.module';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	providers: [ AuthService, JwtStrategy ],
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => (
				{
					secret: config.authConfig.privkey,
				}
			),
			inject: [ ConfigService ],
		}),
		UserModule,
		PassportModule,
		CryptoModule,
	],
	exports: [ PassportModule, AuthService ],
	controllers: [ AuthController ],
})
export class AuthModule {
}
