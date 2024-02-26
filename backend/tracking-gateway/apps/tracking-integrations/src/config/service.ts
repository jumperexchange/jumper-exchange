import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

type Config = {
  PORT: number;
  BROKER_HOST: string;
  BROKER_PORT: number;
  TRACKING_GOOGLE_ANALYTICS_ID: string;
  TRACKING_GOOGLE_ANALYTICS_SECRET: string;
  TRACKING_GOOGLE_ANALYTICS_CLIENT_ID: string;
};

const schema = Joi.object({
  PORT: Joi.number().default(4000),
  TRACKING_GOOGLE_ANALYTICS_ID: Joi.string(),
  TRACKING_GOOGLE_ANALYTICS_SECRET: Joi.string(),
  TRACKING_GOOGLE_ANALYTICS_CLIENT_ID: Joi.string().default('123456.7654322'),
  BROKER_HOST: Joi.string().required(),
  BROKER_PORT: Joi.number().required(),
});

export const TrackingConfigModule = ConfigModule.forRoot({
  validationSchema: schema,
  isGlobal: true,
  envFilePath: '.env.dev',
});

export const TrackingIntegrationsConfigService = ConfigService<Config>;
export type TrackingIntegrationsConfigService = ConfigService<Config>;
