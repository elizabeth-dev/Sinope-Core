import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, mapTo } from 'rxjs/operators';
import { CreatePostDto } from './definitions/CreatePost.dto';
import { PostEntity } from './post.schema';
import { QuestionService } from '../question/question.service';

@Injectable()
export class PostService {
	constructor(
		@InjectModel('Post')
		private readonly postModel: Model<PostEntity>,
		private readonly questionService: QuestionService,
	) {}

	public get(): Observable<PostEntity[]>;
	public get(id: string): Observable<PostEntity>;
	public get(id?: string): Observable<PostEntity | PostEntity[]> {
		if (!id) {
			return from(this.postModel.find().exec());
		}

		return from(this.postModel.findById(id).exec());
	}

	public getByProfile(profile: string | string[]): Observable<PostEntity[]> {
		if (typeof profile === 'string')
			return from(
				this.postModel
					.find({ profile: Types.ObjectId(profile) })
					.exec(),
			);

		return from(this.postModel.find({ profile: { $in: profile } }));
	}

	public add(
		{ question, profile, ...newPost }: CreatePostDto,
		user: string,
	): Observable<PostEntity> {
		return from(
			this.postModel.create({
				...newPost,
				profile: Types.ObjectId(profile),
				user: Types.ObjectId(user),
				likes: [],
				...(question && {
					question: Types.ObjectId(question),
				}),
			}),
		).pipe(
			mergeMap((post) =>
				question
					? this.questionService
							.answer(question, post.id)
							.pipe(mapTo(post))
					: of(post),
			),
		);
	}

	public delete(id: string): Observable<void> {
		return from(this.postModel.deleteOne({ _id: id }).exec()).pipe(
			map(() => {
				return;
			}),
		);
	}

	public like(post: string, profile: string): Observable<PostEntity> {
		return from(
			this.postModel
				.findByIdAndUpdate(
					post,
					{
						$addToSet: { likes: Types.ObjectId(profile) },
					},
					{ new: true },
				)
				.exec(),
		);
	}

	public unlike(post: string, profile: string): Observable<PostEntity> {
		return from(
			this.postModel
				.findByIdAndUpdate(
					post,
					{
						$pull: { likes: Types.ObjectId(profile) },
					},
					{ new: true },
				)
				.exec(),
		);
	}

	public getMessages(profile: string): Observable<PostEntity[]> {
		return from(
			this.postModel
				.find({
					profile: Types.ObjectId(profile),
					question: null,
				})
				.exec(),
		);
	}

	public getQuestions(profile: string): Observable<PostEntity[]> {
		return from(
			this.postModel.find({
				profile: Types.ObjectId(profile),
				question: { $exists: true },
			}),
		);
	}
}
