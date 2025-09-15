import { AreaSeries, createChart, LineData, Time } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { CustomTooltip } from './CustomTooltip';
import { CHART_CONFIG } from './constants';
import {
  calculateTooltipPosition,
  calculatePriceScaleRange,
  calculateTimeScaleRange,
  createChartConfig,
  createSeriesConfig,
} from './utils';
import { useTheme } from '@mui/material/styles';
import { LineChartV2Skeleton } from './LineChartV2Skeleton';

export interface LineChartV2Props<T> {
  data: T[];
  dataSetId?: string;
  dateFormat?: string;
  enableCrosshair?: boolean;
  enableGridY?: boolean;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  enableTooltip?: boolean;
  isLoading?: boolean;
  theme: {
    lineColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    pointColor?: string;
  };
}

export const LineChartV2 = <T extends LineData<Time>>(
  props: LineChartV2Props<T>,
) => {
  const {
    data,
    enableCrosshair = false,
    enableGridY = false,
    enableXAxis = false,
    enableYAxis = false,
    enableTooltip = false,
    isLoading = false,
    theme: {
      lineColor = '#8700B8',
      pointColor = '#31007A',
      areaTopColor = '#F2D9F6',
      areaBottomColor = 'white',
    } = {},
  } = props;

  const theme = useTheme();

  if (isLoading) {
    return <LineChartV2Skeleton />;
  }

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    price: 0,
    time: 0,
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(
      chartContainerRef.current,
      createChartConfig(
        theme,
        enableGridY,
        enableXAxis,
        enableYAxis,
        props.dateFormat,
      ),
    );

    const newSeries = chart.addSeries(
      AreaSeries,
      createSeriesConfig(
        lineColor,
        areaTopColor,
        areaBottomColor,
        pointColor,
        enableCrosshair,
      ),
    );

    newSeries.setData(data);

    chart.subscribeCrosshairMove((param) => {
      if (!enableTooltip) {
        return;
      }

      if (param.point && param.seriesData.get(newSeries)) {
        const price = (param.seriesData.get(newSeries) as LineData<Time>)
          ?.value;
        const container = chartContainerRef.current!;
        const { x: left, y: top } = calculateTooltipPosition(
          param.point.x,
          param.point.y,
          container.clientWidth,
          container.clientHeight,
        );
        if (price) {
          setTooltip({
            visible: true,
            x: left,
            y: top,
            price,
            time: param.time as number,
          });
        }
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    });

    const priceRange = calculatePriceScaleRange(data);
    chart.priceScale('left').setVisibleRange(priceRange);

    chart.timeScale().fitContent();
    chart.timeScale().subscribeSizeChange(() => {
      chart.timeScale().fitContent();
    });
    const vr = chart.timeScale().getVisibleLogicalRange();
    const timeRange = calculateTimeScaleRange(vr);
    if (timeRange) {
      chart.timeScale().setVisibleLogicalRange(timeRange);
    }

    return () => {
      chart.remove();
    };
  }, [
    data,
    theme,
    enableCrosshair,
    enableGridY,
    enableXAxis,
    enableYAxis,
    enableTooltip,
    lineColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: `${CHART_CONFIG.HEIGHT}px`,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      />
      <CustomTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        price={tooltip.price}
        time={tooltip.time}
        dateFormat={props.dateFormat}
        dataSetId={props.dataSetId}
      />
    </div>
  );
};
