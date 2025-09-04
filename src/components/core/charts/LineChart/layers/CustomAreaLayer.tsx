import { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';
import { area, curveCardinal } from 'd3-shape';

export interface CustomAreaLayerProps<T extends LineSeries>
  extends LineCustomSvgLayerProps<T> {}

export const CustomAreaLayer = <T extends LineSeries>({
  series,
  xScale,
  yScale,
  innerHeight,
}: CustomAreaLayerProps<T>) => {
  return (
    <g>
      {series.map((s) => {
        const generator = area<any>()
          .x((d: any) => xScale(d.data.x) as number)
          .y0(innerHeight + 1) // +1 to overlap the base grid line
          .y1((d: any) => yScale(d.data.y) as number)
          .curve(curveCardinal);

        return (
          <path key={s.id} d={generator(s.data) || ''} fill="url(#gradient)" />
        );
      })}
    </g>
  );
};
