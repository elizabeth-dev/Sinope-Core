import { ApiProperty } from '@nestjs/swagger';

export class TokenPairRes {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;

	@ApiProperty()
	expiresAt: number;
}
