import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreatePostDto {
	@IsUUID()
	id: string;

	@IsString()
	@Length(1, 280)
	content: string;

	@IsOptional()
	@IsUUID()
	question?: string;
}
