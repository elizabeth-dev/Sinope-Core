import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PostModule } from '../post/post.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [PostModule, ProfileModule]
})
export class SearchModule {}
