import {
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Put,
	UseGuards,
	Query,
	BadRequestException,
	Post,
	Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { PostEntity } from './post.schema';
import { PostService } from './post.service';
import { CreatePostDto } from './definitions/CreatePost.dto';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { ReqUser } from '../shared/decorators/user.decorator';
import { Profile } from '../profile/profile.schema';

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
	@UseGuards(AuthGuard('jwt'))
	public addPost(
		@Body() newPost: CreatePostDto,
		@ReqUser() user: JwtPayload,
	): Observable<PostEntity> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.postService.add(newPost, user.sub);
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
	@UseGuards(AuthGuard('jwt'))
	public delete(@Param('id') id: string): Observable<void> {
		return this.postService.get(id).pipe(
			mergeMap((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				// Check permissions

				return this.postService.delete(id);
			}),
		);
	}

	@Get(':id/likes')
	@UseGuards(AuthGuard('jwt'))
	public getLikes(@Param('id') id: string): Observable<Profile[]> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

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
	@UseGuards(AuthGuard('jwt'))
	public like(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
	): Observable<PostEntity> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.postService.get(id).pipe(
			mergeMap((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				return this.postService.like(id, profileId);
			}),
		);
	}

	@Delete(':id/likes/:profileId')
	@UseGuards(AuthGuard('jwt'))
	public unlike(
		@Param('id') id: string,
		@Param('profileId') profileId: string,
	): Observable<PostEntity> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.postService.get(id).pipe(
			mergeMap((post) => {
				if (!post) {
					throw new NotFoundException();
				}

				return this.postService.unlike(id, profileId);
			}),
		);
	}
}
