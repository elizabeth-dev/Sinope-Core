import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(1, 32)
	public name?: string;
}
