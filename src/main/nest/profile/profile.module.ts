import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
		PostModule,
		UserModule,
	],
	providers: [ProfileService],
	controllers: [ProfileController],
	exports: [ProfileService],
})
export class ProfileModule {}
