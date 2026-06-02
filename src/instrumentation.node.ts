import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  metrics,
} from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import {
  ATTR_SERVICE_INSTANCE_ID,
  ATTR_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { hostname } from 'node:os';

export const initOpenTelemetry = () => {
  const otelLogLevel = process.env.OTEL_LOG_LEVEL?.toLowerCase();
  if (otelLogLevel === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  } else if (otelLogLevel === 'verbose') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.VERBOSE);
  }

  const serviceName = process.env.OTEL_SERVICE_NAME || 'jumper-exchange';
  const metricsEnabled = process.env.OTEL_METRICS_EXPORTER !== 'none';

  const readers = metricsEnabled
    ? [
        new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter(),
          exportIntervalMillis:
            Number(process.env.OTEL_METRIC_EXPORT_INTERVAL) || 60_000,
        }),
      ]
    : [];

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_INSTANCE_ID]: process.env.HOSTNAME || hostname(),
  });

  try {
    const meterProvider = new MeterProvider({ resource, readers });
    metrics.setGlobalMeterProvider(meterProvider);

    registerInstrumentations({
      instrumentations: [new RuntimeNodeInstrumentation()],
      meterProvider,
    });

    new HostMetrics({ name: serviceName }).start();

    console.log('[OpenTelemetry] metrics started', {
      serviceName,
      metricsEnabled,
    });

    let shuttingDown = false;
    const shutdown = async () => {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      try {
        await meterProvider.shutdown();
        diag.info('OpenTelemetry MeterProvider shut down successfully');
        process.exit(0);
      } catch (error: unknown) {
        diag.error('Error shutting down OpenTelemetry MeterProvider', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[OpenTelemetry] failed to start', error);
  }
};
