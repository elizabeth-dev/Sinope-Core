import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { EMPTY, from, Observable } from 'rxjs';

import { ProfileEntity } from '../../profile/profile.entity';
import { ProfileService } from '../../profile/profile.service';

@Injectable()
export class ParseProfilePipe implements PipeTransform<string, Observable<ProfileEntity>> {
	constructor(private readonly profileService: ProfileService) {
	}

	public transform(
		value: string,
		metadata: ArgumentMetadata,
	): Observable<ProfileEntity> {
		if (!value) {
			return EMPTY;
		}

		return from(this.profileService.get(value));
	}
}
