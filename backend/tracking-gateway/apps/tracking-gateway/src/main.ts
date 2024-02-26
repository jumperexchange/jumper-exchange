import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrackingConfigService } from './config/service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(app.get(TrackingConfigService).get('PORT'));
}

bootstrap();
