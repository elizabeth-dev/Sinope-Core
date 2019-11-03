import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../post/post.entity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn({ unsigned: true })
	public privateId: number;

	@Column({
		unique: true,
		type: 'uuid',
	})
	public id: string;

	@Column({ unique: true })
	public tag: string;

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

	@OneToMany(() => PostEntity, (post) => post.author)
	posts: PostEntity[];
}
