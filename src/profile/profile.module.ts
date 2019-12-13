import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { QuestionModule } from '../question/question.module';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';

@Module({
	imports: [ TypeOrmModule.forFeature([ ProfileEntity ]), PostModule, QuestionModule ],
	providers: [ ProfileService ],
	controllers: [ ProfileController ],
	exports: [ ProfileService ],
})
export class ProfileModule {
}
