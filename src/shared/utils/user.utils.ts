import { UserEntity } from 'src/user/user.schema';

export function checkPerms(user: UserEntity, id: string): boolean {
	return user.profiles.map((el) => el.toHexString()).indexOf(id) === -1;
}
