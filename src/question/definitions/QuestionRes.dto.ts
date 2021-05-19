import { ApiProperty } from '@nestjs/swagger';
import { PostRes } from 'src/post/definitions/PostRes.dto';
import { PostEntity } from 'src/post/post.schema';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';
import { ProfileEntity } from 'src/profile/profile.schema';
import { QuestionEntity } from '../question.schema';

export class QuestionRes {
	@ApiProperty()
	public id: string;

	@ApiProperty()
	public content: string;

	@ApiProperty()
	public anonymous: boolean;

	@ApiProperty({ type: Date })
	public date: Date;

	@ApiProperty()
	public fromId?: string;

	@ApiProperty({ type: ProfileRes })
	public from?: ProfileRes;

	@ApiProperty()
	public recipientId: string;

	@ApiProperty({ type: ProfileRes })
	public recipient?: ProfileRes;

	@ApiProperty()
	public answerId?: string;

	@ApiProperty({ type: () => PostRes })
	public answer?: PostRes; // TODO: Check circular mapping

	constructor(questionEntity: QuestionEntity) {
		this.id = questionEntity._id;
		this.content = questionEntity.content;
		this.anonymous = questionEntity.anonymous;
		this.date = questionEntity.date;

		if (this.anonymous === false) {
			if (questionEntity.from && questionEntity.populated('from')) {
				this.fromId = ((questionEntity.from as unknown) as ProfileEntity)._id;
				this.from = new ProfileRes((questionEntity.from as unknown) as ProfileEntity);
			} else {
				this.fromId = questionEntity.from.toHexString();
			}
		}

		if (questionEntity.recipient && questionEntity.populated('recipient')) {
			this.recipientId = ((questionEntity.recipient as unknown) as ProfileEntity)._id;
			this.recipient = new ProfileRes((questionEntity.recipient as unknown) as ProfileEntity);
		} else {
			this.recipientId = questionEntity.recipient.toHexString();
		}

		if (questionEntity.answer && questionEntity.populated('answer')) {
			this.answerId = ((questionEntity.answer as unknown) as PostEntity)._id;
			this.answer = new PostRes((questionEntity.answer as unknown) as PostEntity);
		} else {
			this.answerId = questionEntity.answer.toHexString();
		}
	}
}
