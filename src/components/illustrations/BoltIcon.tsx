import { SvgIconProps } from '@mui/material/SvgIcon';

interface BoltIconProps extends SvgIconProps {}

const BoltIcon = ({ height, width, ...props }: BoltIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || 28}
    height={height || 28}
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      fill="currentColor"
      d="M15.535 1.766a1.167 1.167 0 0 1 1.338 1.458l-.007.021-2.24 7.024a.624.624 0 0 1-.009.026.584.584 0 0 0 .548.788h8.168a1.751 1.751 0 0 1 1.742 1.956 1.75 1.75 0 0 1-.413.935l-11.55 11.9h-.001a1.165 1.165 0 0 1-1.984-1.097l.007-.023 2.24-7.024a.584.584 0 0 0-.268-.748.584.584 0 0 0-.27-.065h-8.17a1.751 1.751 0 0 1-1.362-2.853l.034-.039 11.55-11.9c.171-.187.398-.313.647-.359Z"
    />
  </svg>
);
export default BoltIcon;
