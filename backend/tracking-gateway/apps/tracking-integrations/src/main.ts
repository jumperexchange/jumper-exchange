import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Broker } from '@jumper-commons/commons/infra/broker';
import { TrackingIntegrationsConfigService } from './config/service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configInstance = app.get(TrackingIntegrationsConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Broker,
    options: {
      host: configInstance.get('BROKER_HOST'),
      port: configInstance.get('BROKER_PORT'),
    },
  });

  await app.startAllMicroservices();
  // await app.listen(configInstance.get('PORT'));
  await app.listen(4000);
}

bootstrap();
