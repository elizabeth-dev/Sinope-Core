import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { combineLatest, EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ProfileEntity } from '../profile/profile.entity';
import { Profile } from '../shared/decorators/profile.decorator';

import { User } from '../shared/decorators/user.decorator';
import { ParseProfilePipe } from '../shared/pipes/profile.pipe';

import { UserEntity } from '../user/user.entity';

import { CreatePostDto } from './definitions/CreatePost.dto';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<PostEntity> {
		return this.postService.get(id).pipe(tap((post) => {
			if (!post) {
				throw new NotFoundException();
			}
		}));
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public create(
		@Body() newPost: CreatePostDto,
		@Profile(ParseProfilePipe) profile$: Observable<ProfileEntity>,
		@User() user: UserEntity,
	): Observable<PostEntity> {
		return profile$.pipe(mergeMap((profile) => {
			if (!profile) {
				throw new BadRequestException();
			}

			return this.postService.add(newPost, profile, user);
		}));
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@Profile(ParseProfilePipe) profile$: Observable<ProfileEntity>,
		@User() user: UserEntity,
	): Observable<void> {
		return combineLatest([ profile$, this.postService.get(id) ])
			.pipe(mergeMap(([ profile, post ]) => {
				if (!post) {
					throw new NotFoundException();
				}

				if (!profile) {
					throw new BadRequestException();
				}

				if (post.author.managerIds.indexOf(user.id) === -1) {
					throw new ForbiddenException();
				}

				return this.postService.delete(id).pipe(mergeMap(() => EMPTY));
			}));

	}

	@Put(':id/likes')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public like(
		@Param('id') id: string,
		@Profile() profile: string,
	): Observable<void> {
		return this.postService.like(id, profile);
	}

	@Delete(':id/likes')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public unLike(
		@Param('id') id: string,
		@Profile() profile: string,
	): Observable<void> {
		return this.postService.unLike(id, profile);
	}
}
