import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Meta controller')
@Controller('meta')
export class AppController {
	@Get('status')
	@HttpCode(204)
	public status(): void {
		return;
	}
}
