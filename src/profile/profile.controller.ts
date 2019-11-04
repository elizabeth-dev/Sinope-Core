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

import { EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { UpdateResult } from 'typeorm';
import { User } from '../shared/decorators/user.decorator';
import { ParseProfilePipe } from '../shared/pipes/profile.pipe';
import { UserEntity } from '../user/user.entity';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { UpdateProfileDto } from './definitions/UpdateProfile.dto';

import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {
	}

	@Get(':id')
	public get(@Param('id') id: string): Observable<ProfileEntity> {
		return this.profileService.get(id).pipe(tap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}
		}));
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public create(
		@Body() newProfile: CreateProfileDto,
		@User() user: UserEntity,
	): Observable<ProfileEntity> {
		return this.profileService.create(newProfile, user);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@User() user: UserEntity,
	): Observable<void> {
		return this.profileService.get(id).pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			if (profile.managerIds.indexOf(user.id) === -1) {
				throw new ForbiddenException();
			}

			return this.profileService.delete(id).pipe(mergeMap(() => EMPTY));
		}));
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	public update(
		@Param('id', ParseProfilePipe) profile$: Observable<ProfileEntity>,
		@Body() partial: UpdateProfileDto,
		@User() user: UserEntity,
	): Observable<UpdateResult> {
		return profile$.pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			if (profile.managerIds.indexOf(user.id) === -1) {
				throw new ForbiddenException();
			}

			return this.profileService.update(profile.id, partial);
		}));
	}

	@Put(':id/managers/:userId')
	@UseGuards(AuthGuard('jwt'))
	public addManager(
		@Param('id', ParseProfilePipe) profile$: Observable<ProfileEntity>,
		@Param('userId') manager: string,
		@User() user: UserEntity,
	): Observable<void> {
		return profile$.pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			if (profile.managerIds.indexOf(user.id) === -1) {
				throw new ForbiddenException();
			}

			return this.profileService.addManager(profile, manager);
		}));
	}

	@Delete(':id/managers/:userId')
	@UseGuards(AuthGuard('jwt'))
	public removeManager(
		@Param('id', ParseProfilePipe) profile$: Observable<ProfileEntity>,
		@Param('userId') manager: string,
		@User() user: UserEntity,
	): Observable<void> {
		return profile$.pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			if (profile.managerIds.indexOf(user.id) === -1) {
				throw new ForbiddenException();
			}

			return this.profileService.removeManager(profile, manager);
		}));
	}

	@Get(':id/followers')
	public getFollowers(@Param('id') profileId: string): Observable<ProfileEntity[]> {
		return this.profileService.getFollowers(profileId).pipe(tap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}
		}));
	}

	@Put(':id/followers/:follower')
	@UseGuards(AuthGuard('jwt'))
	public follow(
		@Param('id') profileId: string,
		@Param('follower') follower: string,
		@User() user: UserEntity,
	): Observable<void> {
		if (user.profileIds.indexOf(follower) === -1) {
			throw new ForbiddenException();
		}

		if (profileId === follower) {
			throw new BadRequestException();
		}

		return this.profileService.get(profileId).pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			if (user.profileIds.indexOf(follower) === -1) {
				throw new ForbiddenException();
			}

			return this.profileService.follow(profile, follower);
		}));
	}

	@Delete(':id/followers/:follower')
	@UseGuards(AuthGuard('jwt'))
	public unfollow(
		@Param('id') profileId: string,
		@Param('follower') unfollower: string,
		@User() user: UserEntity,
	): Observable<void> {
		if (user.profileIds.indexOf(unfollower) === -1) {
			throw new ForbiddenException();
		}

		if (profileId === unfollower) {
			throw new BadRequestException();
		}

		return this.profileService.get(profileId).pipe(mergeMap((profile) => {
			if (!profile) {
				throw new NotFoundException();
			}

			return this.profileService.unfollow(profile, unfollower);
		}));
	}
}
