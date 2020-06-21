import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from '../post/post.module';
import { QuestionModule } from '../question/question.module';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Profile.name, schema: ProfileSchema },
		]),
		PostModule,
		QuestionModule,
	],
	providers: [ProfileService],
	controllers: [ProfileController],
	exports: [ProfileService],
})
export class ProfileModule {}
