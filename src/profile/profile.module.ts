import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';

@Module({
	imports: [ TypeOrmModule.forFeature([ ProfileEntity ]) ],
	providers: [ ProfileService ],
	controllers: [ ProfileController ],
	exports: [ ProfileService ],
})
export class ProfileModule {
}
