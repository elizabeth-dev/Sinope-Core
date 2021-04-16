import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserReq {
	@ApiProperty()
	@IsEmail()
	public email: string;

	@ApiProperty()
	@IsString()
	@Length(8, 64)
	public password: string;
}
