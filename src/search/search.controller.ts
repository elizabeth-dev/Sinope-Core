import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { forkJoin, Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ProfileRes } from 'src/profile/definitions/ProfileRes.dto';
import { PostRes } from 'src/post/definitions/PostRes.dto';
import { map } from 'rxjs/operators';
import { SearchRes } from './definitions/SearchRes.dto';

@ApiTags('Search controller')
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get(':searchTerm')
	public searchProfiles(@Param('searchTerm') searchTerm: string): Observable<SearchRes> {
		return forkJoin({
			profiles: this.searchService.profiles(searchTerm),
			posts: this.searchService.posts(searchTerm),
		}).pipe(
			map(
				({ profiles, posts }) =>
					new SearchRes(
						profiles.map((profile) => new ProfileRes(profile)),
						posts.map((post) => new PostRes(post)),
					),
			),
		);
	}
}
