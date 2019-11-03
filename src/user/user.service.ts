import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CryptoService } from '../crypto/crypto.service';

import { CreateUserDto } from './definitions/CreateUser.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
		private readonly cryptoService: CryptoService,
	) {
	}

	public get(id: string): Observable<UserEntity>;
	public get(id?: string[]): Observable<UserEntity[]>;
	public get(id?: string | string[]): Observable<UserEntity | UserEntity[]> {
		if (!id) {
			return from(this.userRepo.find());
		}

		if (typeof id === 'string') {
			return from(this.userRepo.findOne({ id }));
		}

		// TODO: Use id, not PK
		return from(this.userRepo.findByIds(id));
	}

	public getByEmail(email: string): Observable<UserEntity> {
		return from(this.userRepo.findOne({ email }));
	}

	public add(newUser: CreateUserDto): Observable<UserEntity> {
		return this.cryptoService.hash(newUser.password).pipe(mergeMap((password) => {
			const user = this.userRepo.create({
				...newUser,
				password,
			});

			return this.userRepo.save(user);
		}));

	}

	public update(
		id: string,
		partial: QueryDeepPartialEntity<UserEntity>,
	): Observable<UpdateResult> {
		return from(this.userRepo.update({ id }, partial));
	}

	public delete(id: string): Observable<DeleteResult> {
		return from(this.userRepo.delete({ id }));
	}

	public setActivity(
		id: string,
		date?: Date,
	): Observable<UpdateResult> {
		return from(this.userRepo.update({ id }, { lastLogin: date || new Date() }));
	}
}
