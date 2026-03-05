import { useState } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { type NextWebVitalsMetric } from 'next/app';

export const useWebMetricComplete = (
  metricName: NextWebVitalsMetric['name'],
) => {
  const [done, setDone] = useState(false);

  useReportWebVitals((metric) => {
    if (metric.name === metricName) {
      setDone(true);
    }
  });

  return done;
};
