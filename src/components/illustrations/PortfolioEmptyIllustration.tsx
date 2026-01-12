import { useColorScheme, useTheme } from '@mui/material/styles';
import { useId } from 'react';

interface PortfolioEmptyIllustrationProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const PortfolioEmptyIllustration = ({
  width,
  height,
  ...rest
}: PortfolioEmptyIllustrationProps) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const uniqueId = useId();
  const clipPathId = `${uniqueId}-clip`;
  const filterId = `${uniqueId}-filter`;
  const gradientCId = `${uniqueId}-gradient-c`;
  const gradientDId = `${uniqueId}-gradient-d`;
  const gradientEId = `${uniqueId}-gradient-e`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || 246}
      height={height || 246}
      fill="none"
      {...rest}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <g
          stroke="#F7C2FF"
          strokeWidth={0.769}
          filter={`url(#${filterId})`}
          opacity={0.3}
        >
          <circle cx={123} cy={123} r={54.197} />
          <circle cx={123} cy={123} r={78.028} />
          <circle cx={123} cy={123} r={101.091} />
        </g>
        <g
          stroke={
            mode === 'light'
              ? theme.palette.black.main
              : theme.palette.white.main
          }
          strokeOpacity={0.92}
          strokeWidth={1.538}
          opacity={0.15}
        >
          <circle cx={123} cy={123} r={53.813} />
          <circle cx={123} cy={123} r={77.644} opacity={0.6} />
          <circle cx={123} cy={123} r={100.706} opacity={0.5} />
          <circle cx={123} cy={123} r={122.231} opacity={0.2} />
        </g>
        <circle cx={123} cy={123} r={27.675} fill={`url(#${gradientCId})`} />
        <path
          fill="#D35CFF"
          d="m118.053 116.377 5.504-5.504-1.376-1.376c-2.752-2.752-5.504-2.752-8.256 0l-1.376 1.376 5.504 5.504Z"
        />
        <path
          fill="#BEA0EB"
          d="M123.557 124.633c-.609.624-11.008 11.007-11.008 11.007l1.376 1.376c1.376 1.376 5.504 2.752 8.256 0l11.007-11.007c1.376-1.376 1.376-4.128 0-5.504l-6.879-6.88-5.504 5.504 2.752 2.752c.688.688.608 2.127 0 2.752Z"
        />
        <circle
          cx={59.194}
          cy={76.106}
          r={15.375}
          fill={`url(#${gradientDId})`}
        />
        <path
          fill="#fff"
          d="M68.31 73.57h-1.824c-1.004-2.788-3.705-4.7-7.267-4.7h-5.858v4.7h-2.034v1.686h2.034v1.768h-2.034v1.686h2.034v4.643h5.858c3.521 0 6.201-1.896 7.232-4.643h1.86v-1.686h-1.45c.035-.297.056-.605.056-.912v-.041c0-.277-.016-.549-.041-.815h1.44V73.57h-.005Zm-13.309-3.198h4.218c2.614 0 4.556 1.286 5.453 3.193h-9.67v-3.193Zm4.218 11.464h-4.218v-3.131h9.66c-.901 1.876-2.838 3.131-5.442 3.131Zm6.002-5.688c0 .297-.021.589-.062.87H55.001v-1.767h10.163c.036.276.056.563.056.856v.04Z"
        />
        <circle cx={119.925} cy={23.063} r={12.3} fill="#FF0420" />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M114.539 25.815c.468.345 1.068.517 1.801.517.886 0 1.594-.206 2.123-.619.529-.418.902-1.049 1.117-1.892.129-.517.24-1.05.332-1.597a3.27 3.27 0 0 0 .047-.49c0-.43-.108-.8-.324-1.107a1.93 1.93 0 0 0-.886-.702 3.22 3.22 0 0 0-1.274-.24c-1.742 0-2.822.846-3.24 2.539a30.317 30.317 0 0 0-.342 1.597 3.287 3.287 0 0 0-.046.498c0 .647.231 1.145.692 1.496Zm2.807-1.117c-.24.203-.532.305-.877.305-.591 0-.886-.284-.886-.85 0-.135.012-.264.037-.387.11-.597.221-1.102.332-1.514.105-.419.277-.73.517-.933.246-.203.541-.305.886-.305.585 0 .877.28.877.84 0 .136-.012.268-.037.398-.074.43-.181.935-.323 1.514-.105.418-.28.729-.526.932ZM120.226 26.175a.195.195 0 0 0 .157.065h1.255c.062 0 .12-.022.176-.065a.264.264 0 0 0 .101-.166l.425-2.022h1.246c.807 0 1.441-.17 1.902-.508.468-.338.779-.861.932-1.57.037-.165.056-.325.056-.48 0-.535-.209-.944-.628-1.227-.412-.283-.96-.425-1.643-.425h-2.456a.28.28 0 0 0-.175.065.265.265 0 0 0-.102.166l-1.274 6a.221.221 0 0 0 .028.167Zm4.099-3.674a1.102 1.102 0 0 1-.674.212h-1.062l.351-1.652h1.108c.252 0 .431.049.535.147.105.093.157.228.157.407 0 .08-.009.172-.027.277a1 1 0 0 1-.388.609Z"
          clipRule="evenodd"
        />
        <circle cx={220.631} cy={150.675} r={9.225} fill="#416FC0" />
        <path
          fill="#fff"
          d="M218.901 157.088c0 .218-.169.341-.378.275a6.92 6.92 0 0 1 0-13.183c.209-.067.378.057.378.275v.537c0 .146-.11.313-.247.364a5.774 5.774 0 0 0-3.788 5.415 5.775 5.775 0 0 0 3.788 5.416.417.417 0 0 1 .247.364v.537Z"
        />
        <path
          fill="#fff"
          d="M221.208 155.095a.29.29 0 0 1-.289.289h-.576a.29.29 0 0 1-.289-.289v-.91c-1.258-.17-1.874-.874-2.041-1.834a.27.27 0 0 1 .267-.313h.657c.138 0 .254.099.283.234.122.57.453 1.011 1.46 1.011.744 0 1.273-.415 1.273-1.037 0-.622-.312-.858-1.405-1.037-1.612-.217-2.376-.707-2.376-1.97 0-.976.739-1.736 1.882-1.899v-.893c0-.159.13-.288.289-.288h.576c.159 0 .289.129.289.288v.919c.927.166 1.52.693 1.712 1.571a.269.269 0 0 1-.265.321h-.607a.292.292 0 0 1-.277-.212c-.164-.556-.561-.797-1.251-.797-.764 0-1.16.368-1.16.886 0 .547.226.821 1.395.99 1.584.217 2.404.669 2.404 2.017 0 1.025-.761 1.854-1.951 2.043v.91Z"
        />
        <path
          fill="#fff"
          d="M222.739 157.363c-.208.066-.378-.057-.378-.275v-.537c0-.161.097-.309.248-.364a5.775 5.775 0 0 0 3.788-5.416 5.774 5.774 0 0 0-3.788-5.415.417.417 0 0 1-.248-.364v-.537c0-.218.17-.342.378-.275a6.92 6.92 0 0 1 0 13.183Z"
        />
        <circle cx={27.675} cy={147.6} r={9.225} fill="#000" />
        <path
          fill={`url(#${gradientEId})`}
          d="m32.24 149.901-1.523 1.591a.36.36 0 0 1-.259.11H23.24a.176.176 0 0 1-.097-.029.169.169 0 0 1-.032-.261l1.524-1.591a.35.35 0 0 1 .258-.11h7.219c.034 0 .068.01.097.029a.17.17 0 0 1 .077.173.168.168 0 0 1-.045.088Zm-1.523-3.204a.365.365 0 0 0-.259-.109H23.24a.175.175 0 0 0-.162.103.168.168 0 0 0 .033.186l1.524 1.591a.35.35 0 0 0 .258.11h7.219c.034 0 .068-.01.097-.028a.178.178 0 0 0 .065-.076.167.167 0 0 0-.033-.186l-1.523-1.591Zm-7.478-1.143h7.22a.36.36 0 0 0 .258-.109l1.523-1.591a.174.174 0 0 0 .045-.089.164.164 0 0 0-.012-.097.178.178 0 0 0-.065-.076.184.184 0 0 0-.097-.028h-7.219a.358.358 0 0 0-.258.109l-1.524 1.591a.174.174 0 0 0-.044.089.164.164 0 0 0 .012.097.176.176 0 0 0 .161.104Z"
        />
        <circle cx={172.968} cy={63.038} r={15.375} fill="#40477A" />
        <path
          fill="#C8B2F5"
          fillRule="evenodd"
          d="m178.733 64.322-5.765 7.646v-4.293l5.765-3.353Z"
          clipRule="evenodd"
        />
        <path
          fill="#EECBC0"
          fillRule="evenodd"
          d="m167.203 64.322 5.765 7.646v-4.293l-5.765-3.353Z"
          clipRule="evenodd"
        />
        <path
          fill="#87A9F0"
          fillRule="evenodd"
          d="m167.202 63.437 5.766-2.564v5.844l-5.766-3.28Z"
          clipRule="evenodd"
        />
        <path
          fill="#CAB3F5"
          fillRule="evenodd"
          d="m178.733 63.436-5.766-2.563v5.844l5.766-3.28Z"
          clipRule="evenodd"
        />
        <path
          fill="#EECBC0"
          fillRule="evenodd"
          d="m167.203 63.436 5.765-9.047v6.484l-5.765 2.563Z"
          clipRule="evenodd"
        />
        <path
          fill="#B8FBF6"
          fillRule="evenodd"
          d="m178.732 63.436-5.765-9.047v6.483l5.765 2.564Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id={gradientCId}
          x1={125.306}
          x2={125.306}
          y1={150.675}
          y2={95.325}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#140729" />
          <stop offset={1} stopColor="#1E0A3D" />
        </linearGradient>
        <linearGradient
          id={gradientDId}
          x1={59.194}
          x2={59.194}
          y1={56.375}
          y2={94.71}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9A606" />
          <stop offset={1} stopColor="#FBCC5F" />
        </linearGradient>
        <linearGradient
          id={gradientEId}
          x1={23.841}
          x2={31.191}
          y1={151.793}
          y2={143.288}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.08} stopColor="#9945FF" />
          <stop offset={0.3} stopColor="#8752F3" />
          <stop offset={0.5} stopColor="#5497D5" />
          <stop offset={0.6} stopColor="#43B4CA" />
          <stop offset={0.72} stopColor="#28E0B9" />
          <stop offset={0.97} stopColor="#19FB9B" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <path fill="#fff" d="M0 0h246v246H0z" />
        </clipPath>
        <filter
          id={filterId}
          width={221.4}
          height={221.4}
          x={12.3}
          y={12.3}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_210_1300"
            stdDeviation={4.612}
          />
        </filter>
      </defs>
    </svg>
  );
};
export default PortfolioEmptyIllustration;
