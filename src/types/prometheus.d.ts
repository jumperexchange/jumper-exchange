import type { Registry } from 'prom-client';

declare global {
  // eslint-disable-next-line no-var
  var prometheusRegistry: Registry | undefined;
}

export {};
