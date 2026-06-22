import pino from 'pino';

const VALID_LEVELS = new Set([
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
  'silent',
]);
const rawLevel = (process.env.LOG_LEVEL ?? '').toLowerCase();
const level = VALID_LEVELS.has(rawLevel) ? rawLevel : 'info';

export const logger = pino({ level });
