import { ApiProperty } from '@nestjs/swagger';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';
import { ProfileEntity } from 'src/profile/profile.schema';
import { UserEntity } from '../user.schema';

export class UserRes {
	@ApiProperty()
	public id: string;

	@ApiProperty()
	public email: string;

	@ApiProperty()
	public created: Date;

	@ApiProperty({ type: [String] })
	public profileIds: string[];

	@ApiProperty({ type: [ProfileRes] })
	public profiles: ProfileRes[];

	constructor(userEntity: UserEntity) {
		this.id = userEntity._id;
		this.email = userEntity.email;
		this.created = userEntity.created;

		if (userEntity.profiles && userEntity.populated('profiles')) {
			this.profileIds = ((userEntity.profiles as unknown) as ProfileEntity[]).map((el) => el._id);
			this.profiles = ((userEntity.profiles as unknown) as ProfileEntity[]).map((el) => new ProfileRes(el));
		} else {
			this.profileIds = userEntity.profiles.map((el) => el.toHexString());
		}
	}
}
