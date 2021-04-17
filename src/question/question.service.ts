import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { multiPopulate, multiPopulateDoc } from 'src/shared/utils/mongoose.utils';
import { CreateQuestionReq } from './definitions/CreateQuestionReq.dto';
import { QuestionEntity } from './question.schema';

@Injectable()
export class QuestionService {
	constructor(
		@InjectModel('Question')
		private readonly questionModel: Model<QuestionEntity>,
	) {}

	public get(id: string, expand: string[] | string = []): Observable<QuestionEntity> {
		return from(multiPopulate(this.questionModel.findById(id), expand).exec());
	}

	public getByProfile(profile: string, expand: string[] | string = []): Observable<QuestionEntity[]> {
		return from(
			multiPopulate(this.questionModel.find({ recipient: Types.ObjectId(profile), answer: null }), expand).exec(),
		);
	}

	public add(
		{ from: profile, recipient, ...newQuestion }: CreateQuestionReq,
		user: string,
		expand: string[] | string = [],
	): Observable<QuestionEntity> {
		return from(
			this.questionModel.create({
				...newQuestion,
				user: Types.ObjectId(user),
				from: Types.ObjectId(profile),
				recipient: Types.ObjectId(recipient),
			}),
		).pipe(mergeMap((question) => multiPopulateDoc(question, expand).execPopulate()));
	}

	public delete(id: string): Observable<void> {
		return from(this.questionModel.deleteOne({ _id: id })).pipe(
			map(() => {
				return;
			}),
		);
	}

	public answer(question: string, post: string): Observable<void> {
		return from(this.questionModel.updateOne({ _id: question }, { answer: Types.ObjectId(post) })).pipe(
			map(() => {
				return;
			}),
		);
	}
}
