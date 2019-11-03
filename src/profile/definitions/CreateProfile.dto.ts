import { IsAlphanumeric, IsString, IsUUID, Length } from 'class-validator';

export class CreateProfileDto {
	@IsUUID()
	public id: string;

	@IsAlphanumeric()
	@Length(1, 16)
	public tag: string;

	@IsString()
	@Length(1, 32)
	public name: string;
}
