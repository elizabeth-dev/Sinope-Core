import { IsAlphanumeric, IsOptional, IsString, Length } from 'class-validator';

export class CreateProfileDto {
	@IsAlphanumeric()
	@Length(1, 16)
	public tag: string;

	@IsString()
	@Length(1, 32)
	public name: string;

	@IsOptional()
	@IsString()
	public description: string;
}
