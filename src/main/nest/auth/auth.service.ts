import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { forkJoin, from, Observable, of } from 'rxjs';
import { ignoreElements, map, mergeMap, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from '../user/definitions/CreateUser.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AccessToken } from './access-token.schema';
import { TokenPair } from './interfaces/login.interface';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly cryptoService: CryptoService,
		@InjectModel('RefreshToken')
		private readonly refreshTokenModel: Model<RefreshToken>,
		@InjectModel('AccessToken')
		private readonly accessTokenModel: Model<AccessToken>,
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

	public validateToken(accessToken: string): Observable<User | null> {
		return from(
			this.accessTokenModel
				.findOneAndUpdate({ accessToken }, { lastAccess: new Date() })
				.populate('user')
				.exec(),
		).pipe(
			map((token: AccessToken & { user: User }) => {
				if (!token || token.expiresAt.getTime() <= Date.now())
					return null;

				return token.user;
			}),
		);
	}

	public genAccessToken(
		user: string,
		refreshToken: string,
	): Observable<AccessToken> {
		const accessToken = uuidv4();

		return from(
			this.accessTokenModel.create({
				accessToken,
				expiresAt: new Date(Date.now() + 15 * 60000),
				user: Types.ObjectId(user),
				refreshToken,
			}),
		);
	}

	private genRefreshToken(user: string): Observable<string> {
		const refreshToken = uuidv4();

		return from(
			this.refreshTokenModel.create({
				refreshToken,
				user: Types.ObjectId(user),
			}),
		).pipe(map(({ refreshToken }) => refreshToken));
	}

	public refreshAccessToken(oldRefreshToken: string): Observable<TokenPair> {
		const refreshToken = uuidv4();

		return from(
			this.refreshTokenModel
				.findOneAndUpdate(
					{ refreshToken: oldRefreshToken },
					{ refreshToken },
				)
				.populate('user')
				.exec(),
		).pipe(
			mergeMap((tokenEntry: RefreshToken & { user: User }) => {
				// TODO: Check token substitution before checking if user exists [security]
				if (!tokenEntry || !tokenEntry.user)
					throw new UnauthorizedException();

				const { id: sub } = tokenEntry.user;

				return this.genAccessToken(sub, refreshToken).pipe(
					map(({ accessToken, expiresAt }) => ({
						refreshToken,
						accessToken,
						expiresAt: expiresAt.getTime(),
					})),
				);
			}),
		);
	}

	public login({ id: sub }: User): Observable<TokenPair> {
		return this.genRefreshToken(sub).pipe(
			mergeMap((refreshToken) =>
				this.genAccessToken(sub, refreshToken).pipe(
					map(({ accessToken, expiresAt }) => ({
						refreshToken,
						accessToken,
						expiresAt: expiresAt.getTime(),
					})),
				),
			),
		);
	}

	public register(newUser: CreateUserDto): Observable<TokenPair> {
		return this.userService.add(newUser).pipe(
			mergeMap((user) =>
				this.genRefreshToken(user.id).pipe(
					mergeMap((refreshToken) =>
						this.genAccessToken(user.id, refreshToken).pipe(
							map(({ accessToken, expiresAt }) => ({
								refreshToken,
								accessToken,
								expiresAt: expiresAt.getTime(),
							})),
						),
					),
				),
			),
		);
	}

	public logout(refreshToken: string): Observable<void> {
		return forkJoin(
			from(this.refreshTokenModel.deleteOne({ refreshToken }).exec()),
			from(this.accessTokenModel.deleteMany({ refreshToken })),
		).pipe(ignoreElements());
	}
}
