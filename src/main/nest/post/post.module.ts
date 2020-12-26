import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostEntitySchema } from './post.schema';
import { PostService } from './post.service';
import { QuestionModule } from '../question/question.module';
import { HookSyncCallback } from 'mongoose';

const populatePost: HookSyncCallback<any> = function(next) {
	this.populate('profile');
	this.populate('question');
	next();
};

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: 'Post',
				useFactory: () => {
					const schema = PostEntitySchema;
					schema.pre('find', populatePost)
						.pre('findOne', populatePost)
						.pre('findOneAndUpdate', populatePost)
						.pre('save', populatePost);
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
