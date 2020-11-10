import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { forkJoin, Observable } from 'rxjs';
import { Profile } from '../profile/profile.schema';
import { PostEntity } from '../post/post.schema';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {
	}

	@Get(':searchTerm')
	public searchProfiles(@Param('searchTerm') searchTerm: string): Observable<{ profiles: Profile[]; posts: PostEntity[]; }> {
		return forkJoin({
			profiles: this.searchService.profiles(searchTerm),
			posts: this.searchService.posts(searchTerm),
		});
	}
}
