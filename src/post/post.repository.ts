import { EntityRepository, Repository } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { PostEntity } from './post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
	/*public findByPrivateIds = super.findByIds;

	public findByIds(
		ids: string[],
		options?: FindManyOptions<PostEntity>,
	): Promise<PostEntity[]>;
	public findByIds(
		ids: string[],
		// tslint:disable-next-line:unified-signatures
		conditions?: FindConditions<PostEntity>,
	): Promise<PostEntity[]>;
	public findByIds(
		ids: string[],
		optionsOrConditions?: FindManyOptions<PostEntity> | any,
	): Promise<PostEntity[]> {
		const qb = this.createQueryBuilder('post');
		FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
		if (!FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false) {
			FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.metadata);
		}
		return qb.andWhere('post.id IN (:ids)', { ids }).getMany();
	}*/

	public like(
		post: string | PostEntity,
		profile: string | ProfileEntity,
	): Promise<void> {
		return this.createQueryBuilder()
			.relation(PostEntity, 'likes')
			.of(post)
			.add(profile);
	}

	public unLike(
		post: string | PostEntity,
		profile: string | ProfileEntity,
	): Promise<void> {
		return this.createQueryBuilder()
			.relation(PostEntity, 'likes')
			.of(post)
			.remove(profile);
	}
}
