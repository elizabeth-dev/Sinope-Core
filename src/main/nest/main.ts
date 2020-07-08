import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { readFileSync } from 'fs';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		httpsOptions: {
			cert: readFileSync(process.cwd() + '/tls/cert.pem'),
			key: readFileSync(process.cwd() + '/tls/key.pem'),
		},
	});
	const config: ConfigService = app.get('ConfigService');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.setGlobalPrefix('v1');
	app.enableCors({ origin: config.appConfig.corsOrigin });

	await app.listen(config.appConfig.port);
}

bootstrap();
