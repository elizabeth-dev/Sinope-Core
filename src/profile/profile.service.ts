import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserEntity } from '../user/user.entity';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(ProfileEntity) private readonly profileRepo: Repository<ProfileEntity>) {
	}

	public get(id: string): Observable<ProfileEntity>;
	public get(id?: string[]): Observable<ProfileEntity[]>;
	public get(id?: string | string[]): Observable<ProfileEntity | ProfileEntity[]> {
		if (!id) {
			return from(this.profileRepo.find());
		}

		if (typeof id === 'string') {
			return from(this.profileRepo.findOne(id));
		}

		return from(this.profileRepo.findByIds(id));
	}

	public create(
		newProfile: CreateProfileDto,
		manager: UserEntity,
	): Observable<ProfileEntity> {
		const profile = this.profileRepo.create({
			...newProfile,
			managers: [ manager ],
		});

		return from(this.profileRepo.save(profile));
	}

	public delete(id: string): Observable<DeleteResult> {
		return from(this.profileRepo.delete(id));
	}

	public update(
		id: string,
		partial: QueryDeepPartialEntity<ProfileEntity>,
	): Observable<UpdateResult> {
		return from(this.profileRepo.update(id, partial));
	}

	public addManager(
		profile: string | ProfileEntity,
		user: string | UserEntity,
	): Observable<void> {
		return from(this.profileRepo.createQueryBuilder()
			.relation(ProfileEntity, 'managers')
			.of(profile)
			.add(user));
	}

	public removeManager(
		profile: string | ProfileEntity,
		user: string | UserEntity,
	): Observable<void> {
		return from(this.profileRepo.createQueryBuilder()
			.relation(ProfileEntity, 'managers')
			.of(profile)
			.remove(user));
	}

	public getFollowers(id: string): Observable<ProfileEntity[]> {
		return from(this.profileRepo.findOne(
			id,
			{
				relations: [ 'followers' ],
			},
		)).pipe(map((profile) => profile ? profile.followers : undefined));
	}

	public follow(
		profile: string | ProfileEntity,
		follower: string | ProfileEntity,
	): Observable<void> {
		return from(this.profileRepo.createQueryBuilder()
			.relation(ProfileEntity, 'followers')
			.of(profile)
			.add(follower));
	}

	public unfollow(
		profile: string | ProfileEntity,
		unfollower: string | ProfileEntity,
	): Observable<void> {
		return from(this.profileRepo.createQueryBuilder()
			.relation(ProfileEntity, 'followers')
			.of(profile)
			.remove(unfollower));
	}
}
