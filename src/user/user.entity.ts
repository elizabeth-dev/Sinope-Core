import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { ProfileEntity } from '../profile/profile.entity';

@Entity()
export class UserEntity {
	@PrimaryColumn({ type: 'uuid' })
	public id: string;

	@Column()
	public name: string;

	@Column({ unique: true })
	public email: string;

	@Column()
	public password: string;

	@Column({ nullable: true })
	public lastLogin: Date;

	@CreateDateColumn()
	public created: Date;

	@ManyToMany(() => ProfileEntity, (profile) => profile.managers)
	public profiles: ProfileEntity[];

	@OneToMany(() => PostEntity, (post) => post.authorUser)
	public posts: PostEntity[];
}
