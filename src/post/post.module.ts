import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from '../profile/profile.module';

import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
	imports: [ TypeOrmModule.forFeature([ PostRepository ]), ProfileModule ],
	providers: [ PostService ],
	controllers: [ PostController ],
})
export class PostModule {
}
