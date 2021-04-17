import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { combineLatest, from, Observable } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { CreateProfileReq } from './definitions/CreateProfileReq.dto';
import { ProfileEntity } from './profile.schema';
import { UserService } from '../user/user.service';
import { multiPopulate, multiPopulateDoc } from 'src/shared/utils/mongoose.utils';

@Injectable()
export class ProfileService {
	constructor(
		@InjectModel('Profile')
		private readonly profileModel: Model<ProfileEntity>,
		private readonly userService: UserService,
	) {}

	public get(id: string, expand: string[] | string = []): Observable<ProfileEntity> {
		return from(multiPopulate(this.profileModel.findById(id), expand).exec());
	}

	public create(
		newProfile: CreateProfileReq,
		user: string,
		expand: string[] | string = [],
	): Observable<ProfileEntity> {
		return from(
			this.profileModel.create({
				...newProfile,
				following: [],
				followers: [],
			}),
		).pipe(
			mergeMap((profile) => multiPopulateDoc(profile, expand).execPopulate()),
			mergeMap((profile) => this.userService.addProfile(user, profile.id).pipe(mapTo(profile))),
		);
	}

	public delete(id: string): Observable<ProfileEntity> {
		return from(this.profileModel.findByIdAndDelete(id).exec()).pipe(
			mergeMap((profile) => this.userService.removeProfile(id).pipe(mapTo(profile))),
		);
	}

	public update(
		id: string,
		partial: UpdateQuery<ProfileEntity>,
		expand: string[] | string = [],
	): Observable<ProfileEntity> {
		return from(multiPopulate(this.profileModel.findByIdAndUpdate(id, partial, { new: true }), expand));
	}

	public getFollowers(id: string, expand: string[] | string = []): Observable<ProfileEntity[]> {
		// FIXME: Check user input from expand overriding "likes" populate (as the likes populate is the first done, the user expand takes preference, potential undesired behavior injection)
		return from(
			multiPopulate(this.profileModel.findById(id).populate('followers'), expand, 'followers')
				.select('followers')
				.exec(),
		).pipe(map((profile: ProfileEntity & { followers: ProfileEntity[] }) => profile.followers));
	}

	public getFollowing(id: string, expand: string[] | string = []): Observable<ProfileEntity[]> {
		// FIXME: Check user input from expand overriding "likes" populate (as the likes populate is the first done, the user expand takes preference, potential undesired behavior injection)
		return from(
			multiPopulate(this.profileModel.findById(id).populate('following'), expand, 'following')
				.select('following')
				.exec(),
		).pipe(map((profile: ProfileEntity & { following: ProfileEntity[] }) => profile.following));
	}

	public getFollowingIds(id: string): Observable<string[]> {
		return from(this.profileModel.findById(id).exec()).pipe(
			map((profile: ProfileEntity) => profile.following.map((follow) => follow.toHexString())),
		);
	}

	public follow(id: string, follower: string): Observable<void> {
		return combineLatest([
			from(this.profileModel.updateOne({ _id: id }, { $push: { followers: Types.ObjectId(follower) } })),
			from(this.profileModel.updateOne({ _id: follower }, { $push: { following: Types.ObjectId(id) } })),
		]).pipe(
			map(() => {
				return;
			}),
		);
	}

	public unfollow(id: string, unfollower: string): Observable<void> {
		return combineLatest([
			from(this.profileModel.updateOne({ _id: id }, { $pull: { followers: Types.ObjectId(unfollower) } })),
			from(this.profileModel.updateOne({ _id: unfollower }, { $pull: { following: Types.ObjectId(id) } })),
		]).pipe(
			map(() => {
				return;
			}),
		);
	}

	public search(searchTerm: string, expand: string[] | string = []): Observable<ProfileEntity[]> {
		// FIXME: Unvalidated user input
		return from(
			multiPopulate(
				this.profileModel.find({
					$or: [{ name: new RegExp(`${searchTerm}`, 'i') }, { tag: new RegExp(`${searchTerm}`, 'i') }],
				}),
				expand,
			).exec(),
		);
	}
}
