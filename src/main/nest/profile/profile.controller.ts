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
	Put, Query,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { PostEntity } from '../post/post.schema';
import { PostService } from '../post/post.service';
import { ReqUser } from '../shared/decorators/user.decorator';
import { User } from '../user/user.schema';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { UpdateProfileDto } from './definitions/UpdateProfile.dto';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly postService: PostService,
	) {}

	@Get(':id')
	public get(@Param('id') id: string, @Query('profile') fromProfile?: string): Observable<Profile> {
		return this.profileService.get(id, fromProfile).pipe(
			tap((profile) => {
				if (!profile) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Post()
	@UseGuards(AuthGuard('bearer'))
	public create(
		@Body() newProfile: CreateProfileDto,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<Profile> {
		return reqUser$.pipe(
			mergeMap((user) => this.profileService.create(newProfile, user.id)),
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
			mergeMap((user) => {
				if (
					user.profiles.map((el) => el.toHexString()).indexOf(id) ===
					-1
				)
					throw new ForbiddenException();

				return this.profileService.delete(id);
			}),
			map((profile) => {
				if (!profile) throw new NotFoundException();

				return;
			}),
		);
	}

	@Put(':id')
	@UseGuards(AuthGuard('bearer'))
	public update(
		@Param('id') profile: string,
		@Body() partial: UpdateProfileDto,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<Profile> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profile) === -1
				)
					throw new ForbiddenException();

				return this.profileService.update(profile, partial);
			}),
		);
	}

	@Get(':id/followers')
	public getFollowers(@Param('id') profileId: string): Observable<Profile[]> {
		return this.profileService.getFollowers(profileId).pipe(
			tap((followers) => {
				if (!followers) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Get(':id/following')
	public getFollowing(@Param('id') profileId: string): Observable<Profile[]> {
		return this.profileService.getFollowing(profileId).pipe(
			tap((following) => {
				if (!following) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Put(':id/followers/:follower')
	@UseGuards(AuthGuard('bearer'))
	public follow(
		@Param('id') profile: string,
		@Param('follower') follower: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<void> {
		if (profile === follower) {
			throw new BadRequestException();
		}

		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(follower) === -1
				)
					throw new ForbiddenException();

				return this.profileService.follow(profile, follower);
			}),
		);
	}

	@Delete(':id/followers/:follower')
	@UseGuards(AuthGuard('bearer'))
	public unfollow(
		@Param('id') profile: string,
		@Param('follower') unfollower: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<void> {
		if (profile === unfollower) {
			throw new BadRequestException();
		}

		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(unfollower) === -1
				)
					throw new ForbiddenException();

				return this.profileService.unfollow(profile, unfollower);
			}),
		);
	}

	@Get(':id/timeline')
	@UseGuards(AuthGuard('bearer'))
	public timeline(
		@Param('id') profileId: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<PostEntity[]> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profileId) === -1
				)
					throw new ForbiddenException();

				return this.profileService
					.getFollowingIds(profileId)
					.pipe(
						mergeMap((followingIds) =>
							this.postService.getByProfile([
								...followingIds,
								profileId,
							]),
						),
					);
			}),
		);
	}
}
