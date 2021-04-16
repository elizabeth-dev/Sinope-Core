import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostReq {
	@ApiProperty()
	@IsString()
	@Length(1, 280)
	content: string;

	@ApiProperty()
	@IsMongoId()
	profile: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	question?: string;
}
