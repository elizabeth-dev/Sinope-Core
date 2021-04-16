import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CryptoModule } from './crypto/crypto.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				...configService.dbConfig,
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		PostModule,
		ConfigModule,
		CryptoModule,
		ProfileModule,
		QuestionModule,
		SearchModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
