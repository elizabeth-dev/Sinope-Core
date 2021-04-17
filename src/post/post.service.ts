import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { QuestionService } from '../question/question.service';
import { CreatePostReq } from './definitions/CreatePostReq.dto';
import { PostEntity } from './post.schema';
import { ProfileEntity } from '../profile/profile.schema';
import { multiPopulate, multiPopulateDoc } from 'src/shared/utils/mongoose.utils';

@Injectable()
export class PostService {
	constructor(
		@InjectModel('Post')
		private readonly postModel: Model<PostEntity>,
		private readonly questionService: QuestionService,
	) {}

	public get(id: string, expand: string[] | string = []): Observable<PostEntity> {
		return from(multiPopulate(this.postModel.findById(id), expand).exec());
	}

	public getByProfileList(profiles: string[], expand: string[] | string = []): Observable<PostEntity[]> {
		return from(
			multiPopulate(
				this.postModel.find({
					profile: {
						$in: profiles.map((profileId) => Types.ObjectId(profileId)),
					},
				}),
				expand,
			)
				.sort({ date: -1 })
				.exec(),
		);
	}

	public getByProfile(profile: string, expand: string[] | string = []): Observable<PostEntity[]> {
		return from(
			multiPopulate(this.postModel.find({ profile: Types.ObjectId(profile) }), expand)
				.sort({ date: -1 })
				.exec(),
		);
	}

	public add(
		{ question, profile, ...newPost }: CreatePostReq,
		user: string,
		expand: string[] | string = [],
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
			mergeMap((post) => multiPopulateDoc(post, expand).execPopulate()),
			mergeMap((post) =>
				question ? this.questionService.answer(question, post.id).pipe(mapTo(post)) : of(post),
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

	public getLikes(post: string, expand: string[] | string = []): Observable<ProfileEntity[]> {
		return from(
			// FIXME: Check user input from expand overriding "likes" populate (as the likes populate is the first done, the user expand takes preference, potential undesired behavior injection)
			multiPopulate(this.postModel.findById(post).populate('likes'), expand, 'likes').select('likes').exec(),
		).pipe(map((post: PostEntity & { likes: ProfileEntity[] }) => post.likes));
	}

	public like(post: string, profile: string, expand: string[] | string = []): Observable<PostEntity> {
		return from(
			multiPopulate(
				this.postModel.findByIdAndUpdate(
					post,
					{
						$addToSet: { likes: Types.ObjectId(profile) },
					},
					{ new: true },
				),
				expand,
			).exec(),
		);
	}

	public unlike(post: string, profile: string, expand: string[] | string = []): Observable<PostEntity> {
		return from(
			multiPopulate(
				this.postModel.findByIdAndUpdate(
					post,
					{
						$pull: { likes: Types.ObjectId(profile) },
					},
					{ new: true },
				),
				expand,
			).exec(),
		);
	}

	public getMessages(profile: string, expand: string[] | string = []): Observable<PostEntity[]> {
		return from(
			multiPopulate(
				this.postModel.find({
					profile: Types.ObjectId(profile),
					question: null,
				}),
				expand,
			).exec(),
		);
	}

	public getQuestions(profile: string, expand: string[] | string = []): Observable<PostEntity[]> {
		return from(
			multiPopulate(
				this.postModel.find({
					profile: Types.ObjectId(profile),
					question: { $exists: true },
				}),
				expand,
			).exec(),
		);
	}

	public search(searchTerm: string, expand: string[] | string = []): Observable<PostEntity[]> {
		// FIXME: Unvalidated user input
		return from(multiPopulate(this.postModel.find({ content: new RegExp(`${searchTerm}`, 'i') }), expand).exec());
	}
}
