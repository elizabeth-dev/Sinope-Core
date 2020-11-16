import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { combineLatest, from, Observable } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { Profile } from './profile.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
	constructor(@InjectModel('Profile') private readonly profileModel: Model<Profile>,
		private readonly userService: UserService) {
	}

	public get(id: string, fromProfile?: string): Observable<Profile> {
		return from(this.profileModel.findById(id).exec());
	}

	public create(newProfile: CreateProfileDto, user: string): Observable<Profile> {
		return from(this.profileModel.create({
			...newProfile,
			following: [],
			followers: [],
		})).pipe(mergeMap((profile) => this.userService
			.addProfile(user, profile.id)
			.pipe(mapTo(profile))));
	}

	public delete(id: string): Observable<Profile> {
		return from(this.profileModel.findByIdAndDelete(id).exec())
			.pipe(mergeMap((profile) => this.userService.removeProfile(id).pipe(mapTo(profile))));
	}

	public update(id: string, partial: UpdateQuery<Profile>): Observable<Profile> {
		return from(this.profileModel.findByIdAndUpdate(id, partial, { new: true }));
	}

	public getFollowers(id: string): Observable<Profile[]> {
		return from(this.profileModel.findById(id).populate('followers').exec())
			.pipe(map((profile: Profile & { followers: Profile[] }) => profile.followers));
	}

	public getFollowing(id: string): Observable<Profile[]> {
		return from(this.profileModel.findById(id).populate('following').exec())
			.pipe(map((profile: Profile & { following: Profile[] }) => profile.following));
	}

	public getFollowingIds(id: string): Observable<string[]> {
		return from(this.profileModel.findById(id).exec())
			.pipe(map((profile: Profile) => profile.following.map((follow) => follow.toHexString())));
	}

	public follow(id: string, follower: string): Observable<void> {
		return combineLatest(from(this.profileModel.updateOne({ _id: id },
			{ $push: { followers: Types.ObjectId(follower) } },
			)),
			from(this.profileModel.updateOne({ _id: follower },
				{ $push: { following: Types.ObjectId(id) } },
			)),
		).pipe(map(() => {
			return;
		}));
	}

	public unfollow(id: string, unfollower: string): Observable<void> {
		return combineLatest(from(this.profileModel.updateOne({ _id: id },
			{ $pull: { followers: Types.ObjectId(unfollower) } },
			)),
			from(this.profileModel.updateOne({ _id: unfollower },
				{ $pull: { following: Types.ObjectId(id) } },
			)),
		).pipe(map(() => {
			return;
		}));
	}

	public search(searchTerm: string): Observable<Profile[]> {
		// FIXME: Unvalidated user input
		return from(this.profileModel.find({
			$or: [
				{ name: new RegExp(`${searchTerm}`, 'i') },
				{ tag: new RegExp(`${searchTerm}`, 'i') },
			],
		}).exec());
	}
}
