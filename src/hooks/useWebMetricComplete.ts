import { useEffect, useState } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { type NextWebVitalsMetric } from 'next/app';

type WebVitalMetricName = NextWebVitalsMetric['name'];

type PerformanceMetricConfig = {
  entryType: string;
  hasEntry: () => boolean;
  entryMatches?: (entry: PerformanceEntry) => boolean;
};

const PERFORMANCE_METRIC_CONFIG = {
  LCP: {
    entryType: 'largest-contentful-paint',
    hasEntry: () =>
      performance.getEntriesByType('largest-contentful-paint').length > 0,
  },
  FCP: {
    entryType: 'paint',
    hasEntry: () =>
      performance
        .getEntriesByType('paint')
        .some((entry) => entry.name === 'first-contentful-paint'),
    entryMatches: (entry) => entry.name === 'first-contentful-paint',
  },
  TTFB: {
    entryType: 'navigation',
    hasEntry: () => {
      const [navigation] = performance.getEntriesByType('navigation');
      return (
        navigation != null &&
        'responseStart' in navigation &&
        (navigation as PerformanceNavigationTiming).responseStart > 0
      );
    },
  },
} as const satisfies Partial<
  Record<WebVitalMetricName, PerformanceMetricConfig>
>;

type PerformanceApiMetricName = keyof typeof PERFORMANCE_METRIC_CONFIG;

const isPerformanceApiMetric = (
  metricName: WebVitalMetricName,
): metricName is PerformanceApiMetricName =>
  metricName in PERFORMANCE_METRIC_CONFIG;

const isMetricCompleteFromPerformanceApi = (
  metricName: PerformanceApiMetricName,
) => {
  if (typeof window === 'undefined') {
    return false;
  }

  return PERFORMANCE_METRIC_CONFIG[metricName].hasEntry();
};

const observePerformanceMetric = (
  metricName: PerformanceApiMetricName,
  onComplete: () => void,
) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return undefined;
  }

  const config = PERFORMANCE_METRIC_CONFIG[metricName];

  if (isMetricCompleteFromPerformanceApi(metricName)) {
    onComplete();
    return undefined;
  }

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const entryMatches =
        'entryMatches' in config ? config.entryMatches : undefined;
      const hasMatch = entryMatches
        ? entries.some(entryMatches)
        : entries.length > 0;

      if (hasMatch) {
        onComplete();
        observer.disconnect();
      }
    });

    observer.observe({
      type: config.entryType,
      buffered: true,
    });

    return () => {
      observer.disconnect();
    };
  } catch {
    return undefined;
  }
};

export const useWebMetricComplete = (metricName: WebVitalMetricName) => {
  const [done, setDone] = useState(false);

  useReportWebVitals((metric) => {
    if (metric.name === metricName) {
      setDone(true);
    }
  });

  useEffect(() => {
    if (done || !isPerformanceApiMetric(metricName)) {
      return;
    }

    return observePerformanceMetric(metricName, () => {
      setDone(true);
    });
  }, [done, metricName]);

  return done;
};
