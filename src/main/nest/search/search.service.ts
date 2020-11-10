import { Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { ProfileService } from '../profile/profile.service';
import { Observable } from 'rxjs';
import { Profile } from '../profile/profile.schema';
import { PostEntity } from '../post/post.schema';

@Injectable()
export class SearchService {
	constructor(
		private readonly postService: PostService,
		private readonly profileService: ProfileService) {
	}

	public profiles(searchTerm: string): Observable<Profile[]> {
		return this.profileService.search(searchTerm);
	}

	public posts(searchTerm: string): Observable<PostEntity[]> {
		return this.postService.search(searchTerm);
	}
}
