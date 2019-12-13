import { IsBoolean, IsString, IsUUID, Length } from 'class-validator';

export class CreateQuestionDto {
	@IsUUID()
	id: string;

	@IsString()
	@Length(1, 280)
	content: string;

	@IsBoolean()
	anonymous: boolean;

	@IsUUID()
	author: string;
}
