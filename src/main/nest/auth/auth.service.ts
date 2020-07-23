import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { ignoreElements, map, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from '../crypto/crypto.service';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { TokenPair } from './interfaces/login.interface';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService,
		@InjectModel('RefreshToken')
		private readonly tokenModel: Model<RefreshToken>,
	) {}

	public validateUser(
		email: string,
		password: string,
	): Observable<User | null> {
		return this.userService.getByEmail(email).pipe(
			switchMap((user) => {
				if (!user) return of(null);

				return this.cryptoService
					.compareHash(password, user.password)
					.pipe(map((correctPass) => (correctPass ? user : null)));
			}),
		);
	}

	public genJwt(payload: Omit<JwtPayload, 'exp'>): string {
		return this.jwtService.sign(payload);
	}

	private genRefreshToken(user: Types.ObjectId): Observable<string> {
		const refreshToken = uuidv4();

		return from(this.tokenModel.create({ refreshToken, user })).pipe(
			map(({ refreshToken }) => refreshToken),
		);
	}

	public setActivity(id: string): Observable<void> {
		return this.userService.setActivity(id);
	}

	public refreshJwt(oldRefreshToken: string): Observable<TokenPair> {
		const refreshToken = uuidv4();

		return from(
			this.tokenModel
				.findOneAndUpdate(
					{ refreshToken: oldRefreshToken },
					{ refreshToken },
				)
				.populate('user')
				.exec(),
		).pipe(
			map((tokenEntry: RefreshToken & { user: User }) => {
				if (!tokenEntry || !tokenEntry.user)
					throw new UnauthorizedException();

				const { email, name, id: sub } = tokenEntry.user;

				return {
					refreshToken,
					jwt: this.genJwt({ email, name, sub }),
					expiresAt: Date.now() + 15 * 60,
				};
			}),
		);
	}

	public login({ email, name, id: sub }: User): Observable<TokenPair> {
		return this.genRefreshToken(Types.ObjectId(sub)).pipe(
			map((refreshToken) => ({
				refreshToken,
				jwt: this.genJwt({ email, name, sub }),
				expiresAt: Date.now() + 15 * 60,
			})),
		);
	}

	public logout(refreshToken: string): Observable<void> {
		return from(this.tokenModel.deleteOne({ refreshToken }).exec()).pipe(
			ignoreElements(),
		);
	}
}
