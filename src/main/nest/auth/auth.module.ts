import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from '../crypto/crypto.module';
import { UserModule } from '../user/user.module';
import { AccessTokenSchema } from './access-token.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenSchema } from './refresh-token.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
	providers: [AuthService, TokenStrategy, LocalStrategy],
	imports: [
		PassportModule.register({ defaultStrategy: 'bearer' }),
		UserModule,
		PassportModule,
		CryptoModule,
		MongooseModule.forFeature([
			{ name: 'RefreshToken', schema: RefreshTokenSchema },
			{ name: 'AccessToken', schema: AccessTokenSchema },
		]),
	],
	exports: [PassportModule, AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
