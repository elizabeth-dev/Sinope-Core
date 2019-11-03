import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class PostEntity {
	@PrimaryColumn({ type: 'uuid' })
	public id: string;

	@Column()
	public content: string;

	@CreateDateColumn()
	public date: Date;

	@ManyToOne(
		() => UserEntity,
		(user) => user.posts,
		{
			onDelete: 'CASCADE',
			eager: true,
		},
	)
	public author: UserEntity;

	@RelationId((post: PostEntity) => post.likes)
	likeIds: string[];

	@ManyToMany(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
	@JoinTable()
	public likes: UserEntity[];
}
