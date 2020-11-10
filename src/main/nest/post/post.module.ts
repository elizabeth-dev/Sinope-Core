import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostEntitySchema } from './post.schema';
import { PostService } from './post.service';
import { QuestionModule } from '../question/question.module';
import { HookSyncCallback } from 'mongoose';

const populateProfile: HookSyncCallback<any> = (next) => {
	this.populate('profile');
	next();
};

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: 'Post',
				useFactory: () => {
					const schema = PostEntitySchema;
					schema.pre('find', populateProfile)
						.pre('findOne', populateProfile)
						.pre('findOneAndUpdate', populateProfile)
						.pre('save', populateProfile);
					return schema;
				},
			},
		]), QuestionModule,
	],
	providers: [PostService],
	controllers: [PostController],
	exports: [PostService],
})
export class PostModule {
}
