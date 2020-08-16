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
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { Profile } from '../profile/profile.schema';
import { ReqUser } from '../shared/decorators/user.decorator';
import { User } from '../user/user.schema';
import { CreatePostDto } from './definitions/CreatePost.dto';
import { PostEntity } from './post.schema';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get('')
	public getPostsByProfile(
		@Query('profile') profile: string,
		@Query('type') type: string,
	): Observable<PostEntity[]> {
		if (!profile) throw new BadRequestException();

		if (type) {
			if (type === 'message')
				return this.postService.getMessages(profile);
			if (type === 'question')
				return this.postService.getQuestions(profile);
		}

		return this.postService.getByProfile(profile).pipe(
			tap((posts) => {
				if (!posts) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Post('')
	@UseGuards(AuthGuard('bearer'))
	public addPost(
		@Body() newPost: CreatePostDto,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<PostEntity> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(newPost.profile) === -1
				)
					throw new ForbiddenException();

				return this.postService.add(newPost, user.id);
			}),
		);
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<PostEntity> {
		return this.postService.get(id).pipe(
			tap((post) => {
				if (!post) throw new NotFoundException();
			}),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<void> {
		return reqUser$.pipe(
			mergeMap((user) =>
				this.postService.get(id).pipe(
					mergeMap((post) => {
						if (!post) {
							throw new NotFoundException();
						}

						if (
							user.profiles
								.map((el) => el.toHexString())
								.indexOf(post.profile.toHexString()) === -1
						)
							throw new ForbiddenException();

						return this.postService.delete(id);
					}),
				),
			),
		);
	}

	@Get(':id/likes')
	@UseGuards(AuthGuard('bearer'))
	public getLikes(@Param('id') id: string): Observable<Profile[]> {
		return this.postService.get(id).pipe(
			mergeMap((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				return this.postService.getLikes(id);
			}),
		);
	}

	@Put(':id/likes/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public like(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<PostEntity> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profileId) === -1
				)
					throw new ForbiddenException();

				return this.postService.like(id, profileId);
			}),
			map((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				return post;
			}),
		);
	}

	@Delete(':id/likes/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public unlike(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<PostEntity> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profileId) === -1
				)
					throw new ForbiddenException();

				return this.postService.unlike(id, profileId);
			}),
			map((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				return post;
			}),
		);
	}
}
