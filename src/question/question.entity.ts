import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, RelationId } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class QuestionEntity {
	@PrimaryColumn({ type: 'uuid' })
	public id: string;

	@Column()
	public content: string;

	@Column()
	public anonymous: boolean;

	@CreateDateColumn()
	public askedDate: Date;

	@ManyToOne(() => ProfileEntity, (profile) => profile.askedQuestions, { eager: true, onDelete: 'SET NULL' })
	public author: ProfileEntity;

	@ManyToOne(() => UserEntity, (user) => user.askedQuestions, { eager: true, onDelete: 'CASCADE' })
	public authorUser: UserEntity;

	@RelationId((question: QuestionEntity) => question.recipient)
	public recipientId: string;

	@ManyToOne(() => ProfileEntity, (profile) => profile.receivedQuestions)
	public recipient: ProfileEntity;

	@RelationId((question: QuestionEntity) => question.answer)
	public answerId?: string;

	@OneToOne(() => PostEntity, (post) => post.question)
	@JoinColumn()
	public answer?: PostEntity;
}
