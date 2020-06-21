import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { ignoreElements, mergeMap, map } from 'rxjs/operators';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from './definitions/CreateUser.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly cryptoService: CryptoService,
	) {}

	public get(): Observable<User[]>;
	public get(id: string): Observable<User>;
	public get(id?: string): Observable<User | User[]> {
		if (!id) {
			return from(this.userModel.find().populate('profiles').exec());
		}

		return from(this.userModel.findById(id).populate('profiles').exec());
	}

	public getByEmail(email: string): Observable<User> {
		return from(this.userModel.findOne({ email }).exec);
	}

	public add(newUser: CreateUserDto): Observable<User> {
		return this.cryptoService.hash(newUser.password).pipe(
			mergeMap((password) =>
				this.userModel.create({
					...newUser,
					password,
					lastLogin: undefined,
					profiles: [],
				}),
			),
		);
	}

	public update(id: string, partial: UpdateQuery<User>): Observable<User> {
		return from(this.userModel.findByIdAndUpdate(id, partial).exec());
	}

	public delete(id: string): Observable<void> {
		return from(this.userModel.deleteOne({ _id: id }).exec()).pipe(
			map(() => {
				return;
			}),
		);
	}

	public setActivity(id: string, date = new Date()): Observable<never> {
		return from(
			this.userModel.findByIdAndUpdate(id, { lastLogin: date }),
		).pipe(ignoreElements());
	}
}
