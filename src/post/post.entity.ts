import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class PostEntity {
	@PrimaryGeneratedColumn({ unsigned: true })
	public privateId: number;

	@Column({
		unique: true,
		type: 'uuid',
	})
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
	author: UserEntity;
}
