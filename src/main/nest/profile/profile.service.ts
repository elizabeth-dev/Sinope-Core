import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { Profile } from './profile.schema';

@Injectable()
export class ProfileService {
	constructor(
		@InjectModel(Profile.name)
		private readonly profileModel: Model<Profile>,
	) {}

	public get(): Observable<Profile[]>;
	public get(id: string): Observable<Profile>;
	public get(id?: string): Observable<Profile | Profile[]> {
		if (!id) {
			return from(this.profileModel.find().exec());
		}

		return from(this.profileModel.findById(id).exec());
	}

	public create(newProfile: CreateProfileDto): Observable<Profile> {
		return from(
			this.profileModel.create({
				...newProfile,
				following: [],
				followers: [],
			}),
		);
	}

	public delete(id: string): Observable<void> {
		return from(this.profileModel.deleteOne({ _id: id }).exec()).pipe(
			map(() => {
				return;
			}),
		);
	}

	public update(
		id: string,
		partial: UpdateQuery<Profile>,
	): Observable<Profile> {
		return from(
			this.profileModel.findByIdAndUpdate(id, partial, { new: true }),
		);
	}

	public getFollowers(id: string): Observable<Profile[]> {
		return from(
			this.profileModel.findById(id).populate('followers').exec(),
		).pipe(
			map(
				(profile: Profile & { followers: Profile[] }) =>
					profile.followers,
			),
		);
	}

	public getFollowing(id: string): Observable<Profile[]> {
		return from(
			this.profileModel.findById(id).populate('following').exec(),
		).pipe(
			map(
				(profile: Profile & { following: Profile[] }) =>
					profile.following,
			),
		);
	}

	public getFollowingIds(id: string): Observable<string[]> {
		return from(this.profileModel.findById(id).exec()).pipe(
			map((profile: Profile) =>
				profile.following.map((follow) => follow.toHexString()),
			),
		);
	}

	public follow(id: string, follower: string): Observable<void> {
		return combineLatest(
			from(
				this.profileModel.updateOne(
					{ _id: id },
					{ $push: { followers: Types.ObjectId(follower) } },
				),
			),
			from(
				this.profileModel.updateOne(
					{ _id: follower },
					{ $push: { following: Types.ObjectId(id) } },
				),
			),
		).pipe(
			map(() => {
				return;
			}),
		);
	}

	public unfollow(id: string, unfollower: string): Observable<void> {
		return combineLatest(
			from(
				this.profileModel.updateOne(
					{ _id: id },
					{ $pull: { followers: Types.ObjectId(unfollower) } },
				),
			),
			from(
				this.profileModel.updateOne(
					{ _id: unfollower },
					{ $pull: { following: Types.ObjectId(id) } },
				),
			),
		).pipe(
			map(() => {
				return;
			}),
		);
	}
}
