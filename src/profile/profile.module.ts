import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';

@Module({
	imports: [ TypeOrmModule.forFeature([ ProfileEntity ]), PostModule ],
	providers: [ ProfileService ],
	controllers: [ ProfileController ],
	exports: [ ProfileService ],
})
export class ProfileModule {
}
