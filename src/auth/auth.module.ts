import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '../config/config.service';
import { CryptoModule } from '../crypto/crypto.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenSchema, RefreshToken } from './refresh-token.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	providers: [AuthService, JwtStrategy],
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => ({
				secret: config.authConfig.privkey,
				signOptions: {
					expiresIn: '15m',
				},
			}),
			inject: [ConfigService],
		}),
		UserModule,
		PassportModule,
		CryptoModule,
		MongooseModule.forFeature([
			{ name: RefreshToken.name, schema: RefreshTokenSchema },
		]),
	],
	exports: [PassportModule, AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
