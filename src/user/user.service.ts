import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

	public get(): Observable<UserEntity[]>;
	public get(id: string): Observable<UserEntity>;
	public get(id?: string): Observable<UserEntity | UserEntity[]> {
		if (!id) {
			return from(this.userModel.find().populate('profiles').exec());
		}

		return from(this.userModel.findById(id).populate('profiles').exec());
	}

	public getByEmail(email: string): Observable<UserEntity> {
		return from(this.userModel.findOne({ email }).exec());
	}

	public add(newUser: CreateUserReq): Observable<UserEntity> {
		return this.cryptoService.hash(newUser.password).pipe(
			mergeMap((password) =>
				this.userModel.create({
					...newUser,
					password,
					profiles: [],
				}),
			),
		);
	}

	public update(id: string, partial: UpdateQuery<UserEntity>): Observable<UserEntity> {
		return from(this.userModel.findByIdAndUpdate(id, partial, { new: true }).exec());
	}

	public delete(id: string): Observable<void> {
		return from(this.userModel.deleteOne({ _id: id }).exec()).pipe(
			map(() => {
				return;
			}),
		);
	}

	public addProfile(id: string, profile: string): Observable<UserEntity> {
		return from(
			this.userModel
				.findByIdAndUpdate(id, { $addToSet: { profiles: Types.ObjectId(profile) } }, { new: true })
				.exec(),
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
