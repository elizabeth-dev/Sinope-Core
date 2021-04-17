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
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';
import { checkPerms } from 'src/shared/utils/user.utils';
import { ReqUser } from '../shared/decorators/user.decorator';
import { UserEntity } from '../user/user.schema';
import { CreatePostReq } from './definitions/CreatePostReq.dto';
import { PostRes } from './definitions/PostRes.dto';
import { PostService } from './post.service';

@ApiTags('Post controller')
@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get('')
	public getPostsByProfile(@Query('profile') profile: string, @Query('type') type: string): Observable<PostRes[]> {
		if (!profile) throw new BadRequestException();

		if (type) {
			if (type === 'message')
				return this.postService
					.getMessages(profile)
					.pipe(map((posts) => posts.map((post) => new PostRes(post))));
			if (type === 'question')
				return this.postService
					.getQuestions(profile)
					.pipe(map((posts) => posts.map((post) => new PostRes(post))));
		}

		return this.postService.getByProfile(profile).pipe(map((posts) => posts.map((post) => new PostRes(post))));
	}

	@Post('')
	@UseGuards(AuthGuard('bearer'))
	public addPost(@Body() newPost: CreatePostReq, @ReqUser() reqUser$: Observable<UserEntity>): Observable<PostRes> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (checkPerms(user, newPost.profile)) throw new ForbiddenException();

				return this.postService.add(newPost, user.id);
			}),
			map((post) => new PostRes(post)),
		);
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<PostRes> {
		return this.postService.get(id).pipe(
			tap((post) => {
				if (!post) throw new NotFoundException();
			}),
			map((post) => new PostRes(post)),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(@Param('id') id: string, @ReqUser() reqUser$: Observable<UserEntity>): Observable<void> {
		return reqUser$.pipe(
			mergeMap((user) =>
				this.postService.get(id).pipe(
					mergeMap((post) => {
						if (!post) throw new NotFoundException();

						if (checkPerms(user, post.profile.toHexString())) throw new ForbiddenException();

						return this.postService.delete(id);
					}),
				),
			),
		);
	}

	@Get(':id/likes')
	@UseGuards(AuthGuard('bearer'))
	public getLikes(@Param('id') id: string): Observable<ProfileRes[]> {
		return this.postService.get(id).pipe(
			mergeMap((post) => {
				if (!post) throw new NotFoundException();

				return this.postService.getLikes(id);
			}),
			map((profiles) => profiles.map((profile) => new ProfileRes(profile))),
		);
	}

	@Put(':id/likes/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public like(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<PostRes> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (checkPerms(user, profileId)) throw new ForbiddenException();

				return this.postService.like(id, profileId);
			}),
			tap((post) => {
				if (!post) throw new NotFoundException();
			}),
			map((post) => new PostRes(post)),
		);
	}

	@Delete(':id/likes/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public unlike(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<PostRes> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (checkPerms(user, profileId)) throw new ForbiddenException();

				return this.postService.unlike(id, profileId);
			}),
			tap((post) => {
				if (!post) throw new NotFoundException();
			}),
			map((post) => new PostRes(post)),
		);
	}
}
