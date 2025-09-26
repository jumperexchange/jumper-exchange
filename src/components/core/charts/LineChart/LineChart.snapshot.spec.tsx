import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../../vitest.setup';
import { LineChart } from './LineChart';

const data = [
  { date: '2023-01-01', value: 97.92 },
  { date: '2023-01-02', value: 124.45 },
  { date: '2023-01-03', value: 86.26 },
  { date: '2023-01-04', value: 97.28 },
  { date: '2023-01-05', value: 91.52 },
  { date: '2023-01-07', value: 130.35 },
  { date: '2023-01-08', value: 83.77 },
  { date: '2023-01-09', value: 103.57 },
  { date: '2023-01-10', value: 102.31 },
  { date: '2023-01-11', value: 119.63 },
  { date: '2023-01-12', value: 100.87 },
  { date: '2023-01-13', value: 88.29 },
  { date: '2023-01-15', value: 103.58 },
  { date: '2023-01-16', value: 87.97 },
  { date: '2023-01-17', value: 90.75 },
  { date: '2023-01-18', value: 111.31 },
  { date: '2023-01-20', value: 108.49 },
  { date: '2023-01-21', value: 105.54 },
  { date: '2023-01-22', value: 85.69 },
  { date: '2023-01-23', value: 108.31 },
  { date: '2023-01-24', value: 90.05 },
  { date: '2023-01-25', value: 105.59 },
  { date: '2023-02-06', value: 100.71 },
  { date: '2023-03-14', value: 96.55 },
  { date: '2023-04-19', value: 137.6 },
];

const commonArgs = {
  data,
  theme: {
    areaTopColor: '#F2D9F6',
    areaBottomColor: 'white',
    pointColor: '#FF8C42',
    lineColor: '#E65100',
  },
  dateFormat: 'dd MMM yyyy',
  dataSetId: 'tvl',
};

describe('LineChart snapshot', () => {
  it('default matches snapshot', async () => {
    const { container } = render(<LineChart {...commonArgs} />);
    expect(container).toMatchSnapshot();
  });
  it('base layers matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        enableCrosshair={false}
        enableGridY={false}
        enableXAxis={false}
        enableYAxis={false}
        enableTooltip={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('skeleton matches snapshot', async () => {
    const { container } = render(
      <LineChart {...commonArgs} isLoading={true} />,
    );
    expect(container).toMatchSnapshot();
  });
});
