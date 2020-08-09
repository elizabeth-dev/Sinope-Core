import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenPair } from './interfaces/login.interface';
import { User } from '../user/user.schema';
import { mergeMap } from 'rxjs/operators';
import { CreateUserDto } from '../user/definitions/CreateUser.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@UseGuards(AuthGuard('local'))
	public login(
		@Req() req: Request & { user: Observable<User> },
	): Observable<TokenPair> {
		return req.user.pipe(mergeMap((user) => this.authService.login(user)));
	}

	@Post('/register')
	public register(@Body() newUser: CreateUserDto): Observable<TokenPair> {
		return this.authService.register(newUser);
	}

	@Post('/refreshToken')
	public refreshToken(
		@Body() body: { refreshToken: string },
	): Observable<TokenPair> {
		const { refreshToken } = body;
		if (!refreshToken) throw new UnauthorizedException();

		return this.authService.refreshJwt(refreshToken);
	}

	@Post('/logout')
	public logout(@Body() body: { refreshToken: string }): Observable<void> {
		const { refreshToken } = body;

		if (!refreshToken) throw new UnauthorizedException();

		return this.authService.logout(refreshToken);
	}

	@Get('/check')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public check(): void {
		return;
	}
}
