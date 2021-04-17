import { Types } from 'mongoose';

export function includesProfile(list: Types.ObjectId[], profile: string): boolean {
	return list.map((el) => el.toHexString()).indexOf(profile) !== -1;
}
