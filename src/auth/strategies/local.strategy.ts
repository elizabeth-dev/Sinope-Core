import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.schema';
import { map } from 'rxjs/operators';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameFiels: 'email' });
	}

	public validate(email: string, password: string): Observable<User> {
		return this.authService.validateUser(email, password).pipe(
			map((user) => {
				if (!user) throw new UnauthorizedException();

				return user;
			}),
		);
	}
}
