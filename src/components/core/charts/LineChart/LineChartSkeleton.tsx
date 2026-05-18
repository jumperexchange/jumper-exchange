import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useId, type HTMLAttributes } from 'react';

/** Natural area path for mock skeleton data (viewBox 0 0 100 100, matches prior Recharts output). */
const SKELETON_AREA_PATH =
  'M5,78.125C7.5,70.0574969395889,10,61.98999387917781,12.5,61.25C15,60.51000612082219,17.5,67.09752142287765,20,66.875C22.5,66.65247857712235,24.999999999999996,59.61992042931162,27.5,50C30.000000000000004,40.38007957068838,32.50000000000001,28.172796859875877,35,27.5C37.49999999999999,26.827203140124123,40,37.688892131184886,42.5,44.375C45,51.061107868815114,47.5,53.57163461538461,50,50C52.5,46.42836538461539,55,36.77456940727666,57.5,38.75C60,40.72543059272334,62.5,54.33008775550874,65,50C67.5,45.66991224449126,69.99999999999999,23.40507957068838,72.5,16.25C75.00000000000001,9.094920429311621,77.50000000000001,17.049593961737745,80,18.5C82.49999999999999,19.950406038262255,85,14.896544582360644,87.5,16.25C90,17.603455417639356,92.5,25.364227708819676,95,33.125L95,96.125C92.5,96.125,90,96.125,87.5,96.125C85,96.125,82.5,96.125,80,96.125C77.5,96.125,75.00000000000001,96.125,72.5,96.125C69.99999999999999,96.125,67.5,96.125,65,96.125C62.50000000000001,96.125,60,96.125,57.5,96.125C55,96.125,52.5,96.125,50,96.125C47.5,96.125,45,96.125,42.5,96.125C40,96.125,37.5,96.125,35,96.125C32.5,96.125,30.000000000000004,96.125,27.5,96.125C24.999999999999996,96.125,22.5,96.125,20,96.125C17.5,96.125,15,96.125,12.5,96.125C10,96.125,7.5,96.125,5,96.125Z';

const SKELETON_VIEWBOX_SIZE = 100;

export const LineChartSkeleton = () => {
  const maskId = useId().replace(/:/g, '');

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${SKELETON_VIEWBOX_SIZE} ${SKELETON_VIEWBOX_SIZE}`}
      preserveAspectRatio="none"
      aria-hidden
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={SKELETON_VIEWBOX_SIZE}
          height={SKELETON_VIEWBOX_SIZE}
        >
          <path d={SKELETON_AREA_PATH} fill="white" />
        </mask>
      </defs>
      <foreignObject
        x={0}
        y={0}
        width={SKELETON_VIEWBOX_SIZE}
        height={SKELETON_VIEWBOX_SIZE}
        mask={`url(#${maskId})`}
      >
        <div
          {...({
            xmlns: 'http://www.w3.org/1999/xhtml',
            style: {
              display: 'block',
              width: '100%',
              height: '100%',
              margin: 0,
            },
          } as HTMLAttributes<HTMLDivElement> & { xmlns: string })}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{
              transform: 'none',
              borderRadius: 0,
              backgroundColor: 'surface2.main',
            }}
          />
        </div>
      </foreignObject>
    </Box>
  );
};
