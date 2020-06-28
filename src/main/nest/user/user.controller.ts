import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ReqUser } from '../shared/decorators/user.decorator';
import { CreateUserDto } from './definitions/CreateUser.dto';
import { UpdateUserDto } from './definitions/UpdateUser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	public getById(@Param('id') id: string): Observable<User> {
		return this.userService.get(id);
	}

	@Post()
	public create(@Body() newUser: CreateUserDto): Observable<User> {
		return this.userService.add(newUser);
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	public update(
		@Param('id') id: string,
		@Body() partial: UpdateUserDto,
		@ReqUser() user: JwtPayload,
	): Observable<User> {
		if (user.sub === id) return this.userService.update(id, partial);

		throw new ForbiddenException();
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@ReqUser() user: JwtPayload,
	): Observable<void> {
		if (user.sub === id) return this.userService.delete(id);

		throw new ForbiddenException();
	}
}
