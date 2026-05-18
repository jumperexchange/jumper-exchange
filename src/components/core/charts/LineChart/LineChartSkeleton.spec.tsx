import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { LineChartSkeleton } from './LineChartSkeleton';

describe('LineChartSkeleton', () => {
  it('renders mask SVG during SSR', () => {
    const html = renderToStaticMarkup(<LineChartSkeleton />);

    expect(html).toContain('<mask');
    expect(html).toContain('M5,78.125');
    expect(html).toContain('MuiSkeleton');
  });
});
