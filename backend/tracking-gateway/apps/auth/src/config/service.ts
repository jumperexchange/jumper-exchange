import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

type Config = {
  PORT: number;
  BROKER_HOST: string;
  BROKER_PORT: number;
};

const schema = Joi.object({
  PORT: Joi.number().default(5000),
  BROKER_HOST: Joi.string().required(),
  BROKER_PORT: Joi.number().required(),
});

export const AuthConfigModule = ConfigModule.forRoot({
  validationSchema: schema,
  isGlobal: true,
  envFilePath: '.env.dev',
});

export const AuthConfigService = ConfigService<Config>;
export type AuthConfigService = ConfigService<Config>;
