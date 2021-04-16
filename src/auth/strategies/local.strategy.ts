import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from '../../user/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	public validate(email: string, password: string): Observable<UserEntity> {
		return this.authService.validateUser(email, password).pipe(
			map((user) => {
				if (!user) throw new UnauthorizedException();

				return user;
			}),
		);
	}
}
