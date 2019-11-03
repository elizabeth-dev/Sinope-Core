import { IsAlphanumeric, IsEmail, IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
	@IsUUID()
	public id: string;

	@IsAlphanumeric()
	@Length(1, 16)
	public tag: string;

	@IsString()
	@Length(1, 32)
	public name: string;

	@IsEmail()
	public email: string;

	@IsString()
	@Length(8, 64)
	public password: string;
}
