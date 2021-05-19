import { ApiProperty } from '@nestjs/swagger';
import { includesProfile } from 'src/shared/utils/profile.utils';
import { ProfileEntity } from '../profile.schema';

export class ProfileRes {
	@ApiProperty()
	public id: string;

	@ApiProperty()
	public tag: string;

	@ApiProperty()
	public name: string;

	@ApiProperty()
	public description: string;

	@ApiProperty({ type: Date })
	public created: Date;

	@ApiProperty({ type: [String] })
	public followingIds: string[];

	@ApiProperty({ type: [ProfileRes] })
	public following: ProfileRes[];

	@ApiProperty({ type: [String] })
	public followerIds: string[];

	@ApiProperty({ type: [ProfileRes] })
	public followers: ProfileRes[];

	@ApiProperty()
	public followingThem?: boolean;

	@ApiProperty()
	public followingMe?: boolean;

	constructor(profileEntity: ProfileEntity, fromProfile?: string) {
		this.id = profileEntity._id;
		this.tag = profileEntity.tag;
		this.name = profileEntity.name;
		this.description = profileEntity.description;
		this.created = profileEntity.created;

		if (profileEntity.following && profileEntity.populated('following')) {
			this.followingIds = ((profileEntity.following as unknown) as ProfileEntity[]).map((el) => el._id);
			this.following = ((profileEntity.following as unknown) as ProfileEntity[]).map((el) => new ProfileRes(el));
		} else {
			this.followingIds = profileEntity.following.map((el) => el.toHexString());
		}

		if (profileEntity.followers && profileEntity.populated('followers')) {
			this.followerIds = ((profileEntity.followers as unknown) as ProfileEntity[]).map((el) => el._id);
			this.followers = ((profileEntity.followers as unknown) as ProfileEntity[]).map((el) => new ProfileRes(el));
		} else {
			this.followerIds = profileEntity.followers.map((el) => el.toHexString());
		}

		this.followingMe = includesProfile(this.followingIds, fromProfile);
		this.followingThem = includesProfile(this.followerIds, fromProfile);
	}
}
