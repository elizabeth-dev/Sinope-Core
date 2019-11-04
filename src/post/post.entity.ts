import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
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
		() => ProfileEntity,
		(profile) => profile.posts,
		{
			onDelete: 'CASCADE',
			eager: true,
		},
	)
	public author: ProfileEntity;

	@ManyToOne(() => UserEntity, (user) => user.posts)
	public authorUser: UserEntity;

	@RelationId((post: PostEntity) => post.likes)
	public likeIds: string[];

	@ManyToMany(() => ProfileEntity, (profile) => profile.likes, { onDelete: 'CASCADE' })
	@JoinTable()
	public likes: ProfileEntity[];
}
