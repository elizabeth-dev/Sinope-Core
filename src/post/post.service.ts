import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';

import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './definitions/CreatePost.dto';

import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
	constructor(@InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>) {
	}

	public get(id: string): Observable<PostEntity>;
	public get(id?: string[]): Observable<PostEntity[]>;
	public get(id?: string | string[]): Observable<PostEntity | PostEntity[]> {
		if (!id) {
			return from(this.postRepo.find());
		}

		if (typeof id === 'string') {
			return from(this.postRepo.findOne({ id }));
		}

		// TODO: use id not PK
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
}
