import { IsBoolean, IsMongoId, IsString, Length } from 'class-validator';

export class CreateQuestionDto {
	@IsString()
	@Length(1, 280)
	content: string;

	@IsBoolean()
	anonymous: boolean;

	@IsMongoId()
	profile: string;

	@IsMongoId()
	recipient: string;
}
