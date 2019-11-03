import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { User } from '../shared/decorators/user.decorator';

import { UserEntity as UserEntity } from '../user/user.entity';

import { CreatePostDto } from './definitions/CreatePost.dto';

import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<PostEntity> {
		return this.postService.get(id);
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public create(
		@Body() newPost: CreatePostDto,
		@User() user: UserEntity,
	): Observable<PostEntity> {
		return this.postService.add(newPost, user);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@User() user: UserEntity,
	): Observable<void> {
		return this.postService.get(id).pipe(mergeMap((post) => {
			if (!post) {
				throw new NotFoundException();
			}

			if (post.author.id === user.id) {
				return this.postService.delete(id).pipe(mergeMap(() => EMPTY));
			}

			throw new ForbiddenException();
		}));

	}
}
