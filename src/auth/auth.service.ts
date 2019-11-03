import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { CryptoService } from '../crypto/crypto.service';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { LoginRequest } from './definitions/LoginRequest.dto';

import { JwtPayload } from './interfaces/jwt.interface';
import { LoginResponse } from './interfaces/login.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService,
	) {
	}

	public genToken(payload: JwtPayload): string {
		// Generate a new JWT
		return this.jwtService.sign(payload);
	}

	public validateUser(payload: JwtPayload): Observable<UserEntity> {
		// Return user by its JWT sub field
		return this.userService.get(payload.sub);
	}

	public setActivity(id: string): Observable<void> {
		return this.userService.setActivity(id).pipe(mergeMap(() => EMPTY));
	}

	public login(loginData: LoginRequest): Observable<LoginResponse> {
		return this.userService.getByEmail(loginData.email).pipe(mergeMap((user) => {
			if (!user) {
				throw new UnauthorizedException();
			}

			return this.cryptoService.compareHash(
				loginData.password,
				user.password,
			)
				.pipe(map((result) => {
					if (result) {
						return {
							token: this.genToken({
								sub: user.id,
								email: user.email,
								name: user.name,
								tag: user.tag,
							}),
						};
					}

					throw new UnauthorizedException();
				}));
		}));

	}
}
