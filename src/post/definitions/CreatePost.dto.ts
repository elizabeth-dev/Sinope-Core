import { IsMongoId, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
	@IsString()
	@Length(1, 280)
	content: string;

	@IsOptional()
	@IsMongoId()
	question?: string;
}
