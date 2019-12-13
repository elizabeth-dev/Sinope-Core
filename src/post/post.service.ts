import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';

import { DeleteResult, In, IsNull, Not } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './definitions/CreatePost.dto';

import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
	constructor(private readonly postRepo: PostRepository) {
	}

	public get(id: string): Observable<PostEntity>;
	public get(id?: string[]): Observable<PostEntity[]>;
	public get(id?: string | string[]): Observable<PostEntity | PostEntity[]> {
		if (!id) {
			return from(this.postRepo.find());
		}

		if (typeof id === 'string') {
			return from(this.postRepo.findOne(id));
		}

		return from(this.postRepo.findByIds(id));
	}

	public getByAuthor(authorId: string | string[]): Observable<PostEntity[]> {
		return from(this.postRepo.find({
			author: {
				id: authorId
					instanceof Array ? In(authorId) : authorId,
			},
		}));
	}

	public add(
		newPost: CreatePostDto,
		author: ProfileEntity,
		authorUser: UserEntity,
	): Observable<PostEntity> {
		const post = this.postRepo.create({
			...newPost,
			authorUser,
			author,
			question: { id: newPost.question },
		});

		return from(this.postRepo.save(post));
	}

	public delete(id: string): Observable<DeleteResult> {
		return from(this.postRepo.delete(id));
	}

	public like(
		post: string | PostEntity,
		profile: string | ProfileEntity,
	): Observable<void> {
		return from(this.postRepo.like(post, profile));
	}

	public unLike(
		post: string | PostEntity,
		profile: string | ProfileEntity,
	): Observable<void> {
		return from(this.postRepo.unLike(post, profile));
	}

	public getMessages(authorId: string): Observable<PostEntity[]> {
		return from(this.postRepo.find({
			author: {
				id: authorId,
			},
			question: IsNull(),
		}));
	}

	public getQuestions(authorId: string): Observable<PostEntity[]> {
		return from(this.postRepo.find({
			author: {
				id: authorId,
			},
			question: Not(IsNull()),
		}));
	}
}
