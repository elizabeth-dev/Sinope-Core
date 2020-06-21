import {
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { PostEntity } from './post.schema';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

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

	@Put(':id/likes/:profileId')
	@HttpCode(204)
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
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public unLike(
		@Param('id') id: string,
		@Param(':profileId') profileId: string,
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
