import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

type Config = {
  PORT: number;
  BROKER_HOST: string;
  BROKER_PORT: number;
};

const schema = Joi.object<Config>({
  PORT: Joi.number().default(3000),
  BROKER_HOST: Joi.string().required(),
  BROKER_PORT: Joi.number().required(),
});

export const TrackingConfigModule = ConfigModule.forRoot({
  validationSchema: schema,
  isGlobal: true,
  envFilePath: '.env.dev',
});

export const TrackingConfigService = ConfigService<Config>;
export type TrackingConfigService = ConfigService<Config>;
