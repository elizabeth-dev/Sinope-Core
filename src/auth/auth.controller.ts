import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EMPTY, Observable } from 'rxjs';

import { AuthService } from './auth.service';

import { LoginRequest } from './definitions/LoginRequest.dto';
import { LoginResponse } from './interfaces/login.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('/login')
	public login(@Body() loginData: LoginRequest): Observable<LoginResponse> {
		return this.authService.login(loginData);
	}

	@Get('/check')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public check(): Observable<void> {
		return EMPTY;
	}
}
