import { IsAlphanumeric, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsAlphanumeric()
	@Length(1, 16)
	public tag?: string;

	@IsOptional()
	@IsString()
	@Length(1, 32)
	public name?: string;
}
