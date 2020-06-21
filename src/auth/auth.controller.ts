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
import { User } from 'src/user/user.schema';
import { AuthService } from './auth.service';
import { TokenPair } from './interfaces/login.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@UseGuards(AuthGuard('local'))
	public login(
		@Req() req: Request & { user: User },
	): Observable<TokenPair> {
		return this.authService.login(req.user);
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
