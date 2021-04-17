import { ApiProperty } from '@nestjs/swagger';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';
import { ProfileEntity } from 'src/profile/profile.schema';
import { QuestionRes } from 'src/question/definitions/QuestionRes.dto';
import { QuestionEntity } from 'src/question/question.schema';
import { PostEntity } from '../post.schema';

export class PostRes {
	@ApiProperty()
	public id: string;

	@ApiProperty()
	public content: string;

	@ApiProperty()
	public date: Date;

	@ApiProperty()
	public profileId: string;

	@ApiProperty()
	public profile?: ProfileRes;

	@ApiProperty({ type: [String] })
	public likeIds: string[];

	@ApiProperty({ type: [ProfileRes] })
	public likes?: ProfileRes[];

	@ApiProperty()
	public questionId?: string;

	@ApiProperty({ type: () => QuestionRes })
	public question?: QuestionRes;

	constructor(postEntity: PostEntity) {
		this.id = postEntity._id;
		this.content = postEntity.content;
		this.date = postEntity.date;

		if (postEntity.profile && postEntity.populated('profile')) {
			this.profileId = ((postEntity.profile as unknown) as ProfileEntity)._id;
			this.profile = new ProfileRes((postEntity.profile as unknown) as ProfileEntity);
		} else {
			this.profileId = postEntity.profile.toHexString();
		}

		if (postEntity.likes && postEntity.populated('likes')) {
			this.likeIds = ((postEntity.likes as unknown) as ProfileEntity[]).map((el) => el._id);
			this.likes = ((postEntity.likes as unknown) as ProfileEntity[]).map((el) => new ProfileRes(el));
		} else {
			this.likeIds = postEntity.likes.map((el) => el.toHexString());
		}

		if (postEntity.question && postEntity.populated('question')) {
			this.questionId = ((postEntity.question as unknown) as QuestionEntity)._id;
			this.question = new QuestionRes((postEntity.question as unknown) as QuestionEntity);
		} else {
			this.questionId = postEntity.question.toHexString();
		}
	}
}
