import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('meta')
export class AppController {
	/*constructor(
		private readonly healthService: HealthCheckService,
		private readonly mongoose: MongooseHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
	) {}*/

	@Get('status')
	@HttpCode(204)
	public status(): void {
		return;
	}

	/*@Get('health')
	public health(): any {
		return this.healthService.check([
			() => this.mongoose.pingCheck('db'),
		]);
	}*/
}
