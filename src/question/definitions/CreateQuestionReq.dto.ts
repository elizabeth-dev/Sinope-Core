import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsString, Length } from 'class-validator';

export class CreateQuestionReq {
	@ApiProperty()
	@IsString()
	@Length(1, 280)
	content: string;

	@ApiProperty()
	@IsBoolean()
	anonymous: boolean;

	@ApiProperty()
	@IsMongoId()
	from: string;

	@ApiProperty()
	@IsMongoId()
	recipient: string;
}
