import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { multiPopulate, multiPopulateDoc } from 'src/shared/utils/mongoose.utils';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserReq } from './definitions/CreateUserReq.dto';
import { UserEntity } from './user.schema';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User')
		private readonly userModel: Model<UserEntity>,
		private readonly cryptoService: CryptoService,
	) {}

	public get(id: string, expand: string[] | string = []): Observable<UserEntity> {
		return from(multiPopulate(this.userModel.findById(id), expand).exec());
	}

	public getByEmail(email: string): Observable<UserEntity> {
		return from(this.userModel.findOne({ email }).exec());
	}

	public add(newUser: CreateUserReq, expand: string[] | string = []): Observable<UserEntity> {
		return this.cryptoService.hash(newUser.password).pipe(
			mergeMap((password) =>
				this.userModel.create({
					...newUser,
					password,
					profiles: [],
				}),
			),
			mergeMap((user) => multiPopulateDoc(user, expand).execPopulate()),
		);
	}

	public update(
		id: string,
		partial: UpdateQuery<UserEntity>,
		expand: string[] | string = [],
	): Observable<UserEntity> {
		return from(multiPopulate(this.userModel.findByIdAndUpdate(id, partial, { new: true }), expand).exec());
	}

	public delete(id: string): Observable<void> {
		return from(this.userModel.deleteOne({ _id: id }).exec()).pipe(
			map(() => {
				return;
			}),
		);
	}

	public addProfile(id: string, profile: string, expand: string[] | string = []): Observable<UserEntity> {
		return from(
			multiPopulate(
				this.userModel.findByIdAndUpdate(
					id,
					{ $addToSet: { profiles: Types.ObjectId(profile) } },
					{ new: true },
				),
				expand,
			).exec(),
		);
	}

	public removeProfile(exProfile: string, id?: string): Observable<void> {
		if (id) {
			return from(
				this.userModel
					.updateOne(
						{ _id: Types.ObjectId(id) },
						{ $pull: { profiles: Types.ObjectId(exProfile) } },
						{ new: true },
					)
					.exec(),
			).pipe(
				map(() => {
					return;
				}),
			);
		}

		const exProfileId = Types.ObjectId(exProfile);

		return from(
			this.userModel
				.updateMany({ profiles: exProfileId }, { $pull: { profiles: exProfileId } }, { new: true })
				.exec(),
		).pipe(
			map(() => {
				return;
			}),
		);
	}
}
