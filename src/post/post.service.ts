import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';

import { DeleteResult } from 'typeorm';
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

	public add(
		newPost: CreatePostDto,
		author: UserEntity,
	): Observable<PostEntity> {
		const post = this.postRepo.create({
			...newPost,
			author,
		});

		return from(this.postRepo.save(post));
	}

	public delete(id: string): Observable<DeleteResult> {
		return from(this.postRepo.delete({ id }));
	}

	public like(
		post: string | PostEntity,
		user: string | UserEntity,
	): Observable<void> {
		return from(this.postRepo.like(post, user));
	}

	public unLike(
		post: string | PostEntity,
		user: string | UserEntity,
	): Observable<void> {
		return from(this.postRepo.unLike(post, user));
	}
}
