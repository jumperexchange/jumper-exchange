import { CLIENT_PROXY } from '../constants';
import { TrackingConfigService } from '../config/service';
import { ClientProxyFactory, RedisOptions } from '@nestjs/microservices';
import { Broker } from '@jumper-commons/commons/infra/broker';
import { ConfigService } from '@nestjs/config';

export const ClientProxyProvider = {
  provide: CLIENT_PROXY,
  useFactory: (configService: TrackingConfigService) => {
    const svcOptions: RedisOptions = {
      transport: Broker,
      options: {
        host: configService.get('BROKER_HOST'),
        port: configService.get('BROKER_PORT'),
      },
    };
    return ClientProxyFactory.create(svcOptions);
  },
  inject: [ConfigService],
};
