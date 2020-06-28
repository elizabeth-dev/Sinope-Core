import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from '../post/post.module';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Profile.name, schema: ProfileSchema },
		]),
		PostModule,
	],
	providers: [ProfileService],
	controllers: [ProfileController],
	exports: [ProfileService],
})
export class ProfileModule {}
