import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { UpdateResult } from 'typeorm';
import { User } from '../shared/decorators/user.decorator';

import { CreateUserDto } from './definitions/CreateUser.dto';
import { UpdateUserDto } from './definitions/UpdateUser.dto';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<UserEntity> {
		return this.userService.get(id);
	}

	@Post()
	public create(@Body() newUser: CreateUserDto): Observable<UserEntity> {
		return this.userService.add(newUser);
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	public update(
		@Param('id') id: string,
		@Body() partial: UpdateUserDto,
		@User() user: UserEntity,
	): Observable<UpdateResult> {
		if (user.id === id) {
			return this.userService.update(id, partial);
		}

		throw new ForbiddenException();
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@User() user: UserEntity,
	): Observable<void> {
		if (user.id === id) {
			return this.userService.delete(id).pipe(mergeMap(() => EMPTY));
		}

		throw new ForbiddenException();
	}
}
