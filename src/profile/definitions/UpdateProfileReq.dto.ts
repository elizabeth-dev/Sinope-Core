import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileReq {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsAlphanumeric()
	@Length(1, 16)
	public tag: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@Length(1, 32)
	public name: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	public description: string;
}
