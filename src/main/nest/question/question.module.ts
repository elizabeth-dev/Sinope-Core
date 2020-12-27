import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionSchema } from './question.schema';
import { QuestionService } from './question.service';
import { HookSyncCallback } from 'mongoose';

const populateQuestion: HookSyncCallback<any> = function(next) {
	this.populate('from');
	next();
};

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: 'Question',
				useFactory: () => {
					const schema = QuestionSchema;
					schema.pre('find', populateQuestion)
						.pre('findOne', populateQuestion)
						.pre('findOneAndUpdate', populateQuestion)
						.pre('save', populateQuestion);
					return schema;
				},
			},
		])
	],
	controllers: [QuestionController],
	providers: [QuestionService],
	exports: [QuestionService],
})
export class QuestionModule {}
