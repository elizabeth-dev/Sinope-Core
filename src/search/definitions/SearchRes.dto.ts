import { ApiProperty } from '@nestjs/swagger';
import { PostRes } from 'src/post/definitions/PostRes.dto';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';

export class SearchRes {
	@ApiProperty({ type: [ProfileRes] })
	profiles: ProfileRes[];

	@ApiProperty({ type: [PostRes] })
	posts: PostRes[];

	constructor(profiles: ProfileRes[], posts: PostRes[]) {
		this.profiles = profiles;
		this.posts = posts;
	}
}
