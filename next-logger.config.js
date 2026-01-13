/* eslint-disable @typescript-eslint/no-require-imports */
const pino = require('pino');
const {
  createGcpLoggingPinoConfig,
} = require('@google-cloud/pino-logging-gcp-config');

const IS_DEVELOPMENT = ['development', 'test'].includes(
  process.env.NODE_ENV || '',
);

const GCP_CONFIG = {
  serviceContext: {
    service: 'jumper-exchange',
    version: process.env.npm_package_version || '1.0.0',
  },
};

const BASE_CONFIG = {
  level: process.env.LOG_LEVEL || 'debug',
  redact: {
    paths: ['req.headers.authorization', 'pid', 'hostname'],
    remove: true,
  },
};

const DEV_CONFIG = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      translateTime: "yyyy-MM-dd'T'HH:mm:ss.l'Z'",
      ignore: 'pid,hostname',
    },
  },
};

const logger = (defaultConfig) =>
  pino(
    IS_DEVELOPMENT
      ? { ...BASE_CONFIG, ...DEV_CONFIG, ...defaultConfig }
      : createGcpLoggingPinoConfig(GCP_CONFIG, {
          ...BASE_CONFIG,
          ...defaultConfig,
        }),
  );

module.exports = { logger };
