import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '../crypto/crypto.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [ TypeOrmModule.forFeature([ UserEntity ]), CryptoModule ],
	providers: [ UserService ],
	controllers: [ UserController ],
	exports: [ UserService ],
})
export class UserModule {
}
