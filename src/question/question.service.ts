import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateQuestionReq } from './definitions/CreateQuestionReq.dto';
import { QuestionEntity } from './question.schema';

@Injectable()
export class QuestionService {
	constructor(
		@InjectModel('Question')
		private readonly questionModel: Model<QuestionEntity>,
	) {}

	public get(): Observable<QuestionEntity[]>;
	public get(id: string): Observable<QuestionEntity>;
	public get(id?: string): Observable<QuestionEntity | QuestionEntity[]> {
		if (!id) {
			return from(this.questionModel.find().exec());
		}

		return from(this.questionModel.findById(id).exec());
	}

	public getByProfile(profile: string): Observable<QuestionEntity[]> {
		return from(
			this.questionModel
				.find({ recipient: Types.ObjectId(profile), answer: null })
				.exec(),
		);
	}

	public add(
		{ from: profile, recipient, ...newQuestion }: CreateQuestionReq,
		user: string,
	): Observable<QuestionEntity> {
		return from(
			this.questionModel.create({
				...newQuestion,
				user: Types.ObjectId(user),
				from: Types.ObjectId(profile),
				recipient: Types.ObjectId(recipient),
			}),
		);
	}

	public delete(id: string): Observable<void> {
		return from(this.questionModel.deleteOne({ _id: id })).pipe(
			map(() => {
				return;
			}),
		);
	}

	public answer(question: string, post: string): Observable<void> {
		return from(
			this.questionModel.updateOne(
				{ _id: question },
				{ answer: Types.ObjectId(post) },
			),
		).pipe(
			map(() => {
				return;
			}),
		);
	}
}
