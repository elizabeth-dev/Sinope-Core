import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config: ConfigService = app.get('ConfigService');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.setGlobalPrefix('v1');
	app.enableCors({ origin: config.appConfig.corsOrigin });

	// Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Sinope')
		.setDescription('Sinope API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);

	await app.listen(config.appConfig.port);
}

bootstrap();
