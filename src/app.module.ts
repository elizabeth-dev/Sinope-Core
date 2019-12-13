import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CryptoModule } from './crypto/crypto.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async (config: ConfigService) => (
				{
					...config.dbConfig,
					type: 'mysql' as 'mysql', // ??
					entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
					migrations: [ __dirname + '/**/*.migration{.ts,.js}' ],
					migrationsTableName: 'TypeORM_migrations',
					charset: 'utf8mb4_0900_ai_ci',
					timezone: '+02:00',
				}
			),
			inject: [ ConfigService ],
		}), AuthModule, UserModule, PostModule, ConfigModule, CryptoModule, ProfileModule, QuestionModule,
	],
	controllers: [ AppController ],
	providers: [],
})
export class AppModule {
}
