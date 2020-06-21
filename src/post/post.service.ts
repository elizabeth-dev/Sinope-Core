import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatePostDto } from './definitions/CreatePost.dto';
import { PostEntity } from './post.schema';

@Injectable()
export class PostService {
	constructor(
		@InjectModel('Post')
		private readonly postModel: Model<PostEntity>,
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
			return from(this.postModel.find({ profile }).exec());

		return from(this.postModel.find({ profile: { $in: profile } }));
	}

	public add(
		{ question, ...newPost }: CreatePostDto,
		profile: string,
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
				.findByIdAndUpdate(post, {
					$push: { likes: Types.ObjectId(profile) },
				})
				.exec(),
		);
	}

	public unlike(post: string, profile: string): Observable<PostEntity> {
		return from(
			this.postModel
				.findByIdAndUpdate(post, {
					$pull: { likes: Types.ObjectId(profile) },
				})
				.exec(),
		);
	}

	public getMessages(profile: string): Observable<PostEntity[]> {
		return from(
			this.postModel
				.find({
					profile,
					question: null,
				})
				.exec(),
		);
	}

	public getQuestions(profile: string): Observable<PostEntity[]> {
		return from(
			this.postModel.find({
				profile,
				question: { $exists: true },
			}),
		);
	}
}
