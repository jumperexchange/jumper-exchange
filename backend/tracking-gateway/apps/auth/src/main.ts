import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Broker } from '@jumper-commons/commons/infra/broker';
import { AuthModule } from './auth.module';
import { AuthConfigService } from './config/service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configInstance = app.get(AuthConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Broker,
    options: {
      host: configInstance.get('BROKER_HOST'),
      port: configInstance.get('BROKER_PORT'),
    },
  });

  await app.startAllMicroservices();
  // await app.listen(configInstance.get('PORT'));
  await app.listen(6000);
}

bootstrap();
