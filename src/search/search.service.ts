import { Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { ProfileService } from '../profile/profile.service';
import { Observable } from 'rxjs';
import { ProfileEntity } from '../profile/profile.schema';
import { PostEntity } from '../post/post.schema';

@Injectable()
export class SearchService {
	constructor(private readonly postService: PostService, private readonly profileService: ProfileService) {}

	public profiles(searchTerm: string, expand: string[] | string = []): Observable<ProfileEntity[]> {
		return this.profileService.search(searchTerm, expand);
	}

	public posts(searchTerm: string, expand: string[] | string = []): Observable<PostEntity[]> {
		return this.postService.search(searchTerm, expand);
	}
}
