import { Body, Controller, Get, HttpCode, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenPairRes } from './definitions/TokenPairRes.dto';
import { UserEntity } from '../user/user.schema';
import { mergeMap } from 'rxjs/operators';
import { CreateUserReq } from '../user/definitions/CreateUserReq.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth controller')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@UseGuards(AuthGuard('local'))
	public login(@Req() req: Request & { user: Observable<UserEntity> }): Observable<TokenPairRes> {
		return req.user.pipe(mergeMap((user) => this.authService.login(user)));
	}

	@Post('/register')
	public register(@Body() newUser: CreateUserReq): Observable<TokenPairRes> {
		return this.authService.register(newUser);
	}

	@Post('/refreshToken')
	public refreshToken(@Body() body: { refreshToken: string }): Observable<TokenPairRes> {
		const { refreshToken } = body;
		if (!refreshToken) throw new UnauthorizedException();

		return this.authService.refreshAccessToken(refreshToken);
	}

	@Post('/logout')
	public logout(@Body() body: { refreshToken: string }): Observable<void> {
		const { refreshToken } = body;

		if (!refreshToken) throw new UnauthorizedException();

		return this.authService.logout(refreshToken);
	}

	@Get('/check')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public check(): void {
		return;
	}
}
