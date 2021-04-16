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
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { PostRes } from 'src/post/definitions/PostRes.dto';
import { PostService } from '../post/post.service';
import { ReqUser } from '../shared/decorators/user.decorator';
import { UserEntity } from '../user/user.schema';
import { CreateProfileReq } from './definitions/CreateProfileReq.dto';
import { ProfileRes } from './definitions/ProfileRes.dto';
import { UpdateProfileReq } from './definitions/UpdateProfileReq.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile controller')
@Controller('profiles')
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly postService: PostService,
	) {}

	@Get(':id')
	public get(
		@Param('id') id: string,
		@Query('profile') fromProfile?: string,
	): Observable<ProfileRes> {
		return this.profileService.get(id).pipe(
			tap((profile) => {
				if (!profile) {
					throw new NotFoundException();
				}
			}),
			map((profile) => new ProfileRes(profile)),
		);
	}

	@Post()
	@UseGuards(AuthGuard('bearer'))
	public create(
		@Body() newProfile: CreateProfileReq,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<ProfileRes> {
		return reqUser$.pipe(
			mergeMap((user) => this.profileService.create(newProfile, user.id)),
			map((profile) => new ProfileRes(profile)),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
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

	@Patch(':id')
	@UseGuards(AuthGuard('bearer'))
	public update(
		@Param('id') profile: string,
		@Body() partial: UpdateProfileReq,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<ProfileRes> {
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
			map((profile) => new ProfileRes(profile)),
		);
	}

	@Get(':id/followers')
	public getFollowers(
		@Param('id') profileId: string,
	): Observable<ProfileRes[]> {
		return this.profileService.getFollowers(profileId).pipe(
			tap((followers) => {
				if (!followers) {
					throw new NotFoundException();
				}
			}),
			map((profiles) =>
				profiles.map((profile) => new ProfileRes(profile)),
			),
		);
	}

	@Get(':id/following')
	public getFollowing(
		@Param('id') profileId: string,
	): Observable<ProfileRes[]> {
		return this.profileService.getFollowing(profileId).pipe(
			tap((following) => {
				if (!following) {
					throw new NotFoundException();
				}
			}),
			map((profiles) =>
				profiles.map((profile) => new ProfileRes(profile)),
			),
		);
	}

	@Put(':id/followers/:follower')
	@UseGuards(AuthGuard('bearer'))
	public follow(
		@Param('id') profile: string,
		@Param('follower') follower: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
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
		@ReqUser() reqUser$: Observable<UserEntity>,
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
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<PostRes[]> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profileId) === -1
				)
					throw new ForbiddenException();

				return this.profileService.getFollowingIds(profileId);
			}),
			mergeMap((followingIds) =>
				this.postService.getByProfile([...followingIds, profileId]),
			),
			map((posts) => posts.map((post) => new PostRes(post))),
		);
	}
}
