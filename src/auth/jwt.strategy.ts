import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { map } from 'rxjs/operators';

import { ConfigService } from '../config/config.service';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly config: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.authConfig.privkey,
		});
	}

	public async validate(payload: JwtPayload): Promise<UserEntity> {
		return this.authService.validateUser(payload).pipe(map((user) => {
			if (!user) {
				throw new UnauthorizedException();
			}

			this.authService.setActivity(user.id).subscribe();
			return user;
		})).toPromise();

	}
}
