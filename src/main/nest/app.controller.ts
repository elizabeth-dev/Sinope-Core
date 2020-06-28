import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('meta')
export class AppController {

	@Get('status') @HttpCode(204)
	public status(): void {
		return;
	}
}
