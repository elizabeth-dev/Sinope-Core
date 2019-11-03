import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, RelationId } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class ProfileEntity {
	@PrimaryColumn({ type: 'uuid' })
	public id: string;

	@Column({ unique: true })
	public tag: string;

	@Column()
	public name: string;

	@CreateDateColumn()
	public created: Date;

	@RelationId((profile: ProfileEntity) => profile.managers)
	public managerIds: string[];

	@ManyToMany(() => UserEntity, (user) => user.profiles, { onDelete: 'CASCADE' })
	@JoinTable()
	public managers: UserEntity[];

	@OneToMany(() => PostEntity, (post) => post.author)
	public posts: PostEntity[];

	@ManyToMany(() => PostEntity, (post) => post.likes)
	public likes: PostEntity[];
}
