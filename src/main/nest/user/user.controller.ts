import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Param,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ReqUser } from '../shared/decorators/user.decorator';
import { UpdateUserDto } from './definitions/UpdateUser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { mergeMap } from 'rxjs/operators';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('')
	@UseGuards(AuthGuard('bearer'))
	public getSelf(@ReqUser() user: Observable<User>): Observable<User> {
		return user;
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<User> {
		return this.userService.get(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard('bearer'))
	public update(
		@Param('id') id: string,
		@Body() partial: UpdateUserDto,
		@ReqUser() user: Observable<User>,
	): Observable<User> {
		return user.pipe(
			mergeMap((user) => {
				if (user.id !== id) throw new ForbiddenException();
				return this.userService.update(id, partial);
			}),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(
		@Param('id') id: string,
		@ReqUser() user: Observable<User>,
	): Observable<void> {
		return user.pipe(
			mergeMap((user) => {
				if (user.id !== id) throw new ForbiddenException();
				return this.userService.delete(id);
			}),
		);
	}

	@Put(':id/profiles/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public addProfile(
		@Param('id') user: string,
		@Param('profileId') profile: string,
	): Observable<User> {
		return this.userService.addProfile(user, profile);
	}

	@Delete(':id/profiles/:profileId')
	@UseGuards(AuthGuard('bearer'))
	public removeProfile(
		@Param('id') user: string,
		@Param('profileId') profile: string,
	): Observable<User> {
		return this.userService.removeProfile(profile, user);
	}
}
