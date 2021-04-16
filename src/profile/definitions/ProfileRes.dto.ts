import { ApiProperty } from '@nestjs/swagger';
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

	@ApiProperty()
	public created: Date;

	@ApiProperty({ type: [String] })
	public followingIds: string[];

	@ApiProperty({ type: [String] })
	public followerIds: string[];

	@ApiProperty()
	public followingThem?: boolean;

	@ApiProperty()
	public followingMe?: boolean;

	constructor(profileEntity: ProfileEntity) {
		this.id = profileEntity._id;
		this.tag = profileEntity.tag;
		this.name = profileEntity.name;
		this.description = profileEntity.description;
		this.created = profileEntity.created;
		this.followingIds = profileEntity.following.map((el) =>
			el.toHexString(),
		);
		this.followerIds = profileEntity.followers.map((el) =>
			el.toHexString(),
		);
	}
}
