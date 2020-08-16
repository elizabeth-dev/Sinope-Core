import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../user/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super();
	}

	public validate(token: string): Observable<User> {
		return this.authService.validateToken(token).pipe(
			map((user) => {
				if (!user) throw new UnauthorizedException();

				return user;
			}),
		);
	}
}
