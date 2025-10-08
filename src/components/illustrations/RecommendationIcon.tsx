import { SvgIconProps } from '@mui/material';

interface RecommendationIconProps extends SvgIconProps {}

export const RecommendationIcon = ({
  height,
  width,
}: RecommendationIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width={width || '100%'}
      height={height || '100%'}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          fillOpacity={0.92}
          d="M18.016 14.167c.573 0 1.057.166 1.45.5.393.333.587.722.58 1.166l-8.03 2.5-7-1.666v-7.5h1.95l7.27 2.241c.52.173.78.484.78.934 0 .26-.113.489-.34.683-.227.194-.513.297-.86.308h-2.8l-1.75-.558-.33.783 2.08.609h7Zm-4-11.475c.707-.684 1.607-1.025 2.7-1.025.907 0 1.673.277 2.3.833.627.556.96 1.194 1 1.917 0 .572-.333 1.255-1 2.05-.667.794-1.323 1.458-1.97 1.991-.647.534-1.657 1.325-3.03 2.375a116.845 116.845 0 0 1-3.06-2.375c-.653-.533-1.31-1.197-1.97-1.991-.66-.795-.983-1.478-.97-2.05 0-.756.323-1.395.97-1.917s1.427-.8 2.34-.833c1.067 0 1.963.341 2.69 1.025ZM-1 9.167h4.016v9.166H-1V9.167Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
