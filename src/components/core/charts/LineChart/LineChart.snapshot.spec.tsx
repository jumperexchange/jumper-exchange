import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../../vitest.setup';
import { LineChart } from './LineChart';
import { Children, cloneElement } from 'react';
import { ResponsiveContainerProps } from 'recharts';

vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: ({
      children,
      className,
      id,
      ...rest
    }: ResponsiveContainerProps) => (
      <div {...rest}>
        {Children.map(children, (child) =>
          cloneElement(child, { width: 100, height: 100 } as any),
        )}
      </div>
    ),
  };
});

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

  // Edge Cases: Testing calculateVisibleYRange logic

  it('negative values same matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: -5 },
          { date: '2023-01-02', value: -5 },
          { date: '2023-01-03', value: -5 },
          { date: '2023-01-04', value: -5 },
          { date: '2023-01-05', value: -5 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('negative values same small matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: -0.5 },
          { date: '2023-01-02', value: -0.5 },
          { date: '2023-01-03', value: -0.5 },
          { date: '2023-01-04', value: -0.5 },
          { date: '2023-01-05', value: -0.5 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('negative values varying matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: -10 },
          { date: '2023-01-02', value: -25 },
          { date: '2023-01-03', value: -5 },
          { date: '2023-01-04', value: -15 },
          { date: '2023-01-05', value: -20 },
          { date: '2023-01-06', value: -8 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('positive values same matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 100 },
          { date: '2023-01-02', value: 100 },
          { date: '2023-01-03', value: 100 },
          { date: '2023-01-04', value: 100 },
          { date: '2023-01-05', value: 100 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('positive values same small matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 0.5 },
          { date: '2023-01-02', value: 0.5 },
          { date: '2023-01-03', value: 0.5 },
          { date: '2023-01-04', value: 0.5 },
          { date: '2023-01-05', value: 0.5 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('mixed positive negative matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 50 },
          { date: '2023-01-02', value: -20 },
          { date: '2023-01-03', value: 30 },
          { date: '2023-01-04', value: -10 },
          { date: '2023-01-05', value: 40 },
          { date: '2023-01-06', value: -30 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('zero values matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 0 },
          { date: '2023-01-02', value: 0 },
          { date: '2023-01-03', value: 0 },
          { date: '2023-01-04', value: 0 },
          { date: '2023-01-05', value: 0 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('very small values matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 0.001 },
          { date: '2023-01-02', value: 0.003 },
          { date: '2023-01-03', value: 0.002 },
          { date: '2023-01-04', value: 0.0015 },
          { date: '2023-01-05', value: 0.0025 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('very large values matches snapshot', async () => {
    const { container } = render(
      <LineChart
        {...commonArgs}
        data={[
          { date: '2023-01-01', value: 1000000 },
          { date: '2023-01-02', value: 2500000 },
          { date: '2023-01-03', value: 1500000 },
          { date: '2023-01-04', value: 3000000 },
          { date: '2023-01-05', value: 2000000 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
