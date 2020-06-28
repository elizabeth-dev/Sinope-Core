import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@Length(1, 32)
	public name: string;

	@IsEmail()
	public email: string;

	@IsString()
	@Length(8, 64)
	public password: string;
}
