'use client';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IllustrationWrapper } from './Illustration.style';

interface NewsletterHeroIllustrationProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}
const NewsletterHeroDesktopIllustration = ({
  height,
  width,
  ...rest
}: NewsletterHeroIllustrationProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || 648}
    height={height || 389}
    viewBox="0 0 648 389"
    fill="none"
    {...rest}
  >
    <g filter="url(#a)">
      <path
        className="background-color"
        d="M78 36.102c0-10.875 8.817-19.692 19.692-19.692h452.923c10.876 0 19.693 8.817 19.693 19.692v216.616c0 10.876-8.817 19.692-19.693 19.692H97.692C86.817 272.41 78 263.594 78 252.718V36.103Z"
      />
    </g>
    <g filter="url(#b)">
      <path
        className="background-color"
        d="M47.077 54.564c0-12.235 9.919-22.154 22.154-22.154h509.538c12.236 0 22.154 9.919 22.154 22.154v243.692c0 12.236-9.918 22.154-22.154 22.154H69.231c-12.235 0-22.154-9.918-22.154-22.154V54.564Z"
      />
    </g>
    <g filter="url(#c)">
      <path
        className="background-color"
        d="M24 68.41c0-11.045 8.954-20 20-20h560c11.046 0 20 8.955 20 20v272c0 11.046-8.954 20-20 20H44c-11.046 0-20-8.954-20-20v-272Z"
      />
      <path
        className="sub-logo-color"
        d="m70.57 91.9 7.071-7.07-1.767-1.768c-3.536-3.536-7.072-3.536-10.607 0l-1.768 1.768 7.071 7.07Z"
      />
      <path
        className="main-logo-color"
        d="M77.641 102.507c-.781.803-14.142 14.142-14.142 14.142l1.768 1.768c1.768 1.768 7.07 3.536 10.606 0l14.143-14.142c1.767-1.768 1.767-5.303 0-7.07l-8.84-8.84-7.07 7.071 3.535 3.536c.884.884.782 2.733 0 3.535Z"
      />
      <rect
        width={335}
        height={32}
        x={257}
        y={84.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={16}
      />
      <rect
        width={163}
        height={24}
        x={56}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={33}
        height={24}
        x={235}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={132}
        height={24}
        x={284}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={33}
        height={24}
        x={432}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={51}
        height={24}
        x={481}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={68}
        height={24}
        x={56}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={230}
        height={24}
        x={140}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={68}
        height={24}
        x={386}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={119}
        height={24}
        x={470}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={184}
        height={24}
        x={56}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={230}
        height={24}
        x={256}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={68}
        height={24}
        x={502}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={3}
        height={24}
        x={586}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={1.5}
      />
      <rect
        width={36}
        height={24}
        x={56}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={99}
        height={24}
        x={108}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={205}
        height={24}
        x={223}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={45}
        height={24}
        x={444}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={84}
        height={24}
        x={505}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
    </g>
    <defs>
      <filter
        id="a"
        width={531.692}
        height={295.385}
        x={58.308}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={3.282} />
        <feGaussianBlur stdDeviation={9.846} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_8_848" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_8_848"
          result="shape"
        />
      </filter>
      <filter
        id="b"
        width={598.154}
        height={332.308}
        x={24.923}
        y={13.949}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={3.692} />
        <feGaussianBlur stdDeviation={11.077} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_8_848" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_8_848"
          result="shape"
        />
      </filter>
      <filter
        id="c"
        width={648}
        height={360}
        x={0}
        y={28.41}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_8_848" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_8_848"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const NewsletterHeroMobileIllustration = ({
  height,
  width,
  ...rest
}: NewsletterHeroIllustrationProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || 391}
    height={height || 389}
    viewBox="0 0 391 389"
    fill="none"
    {...rest}
  >
    <g filter="url(#a)">
      <path
        className="background-color"
        d="M64 36.102c0-10.875 8.817-19.692 19.692-19.692h223.616c10.875 0 19.692 8.817 19.692 19.692v216.616c0 10.876-8.817 19.692-19.692 19.692H83.692C72.817 272.41 64 263.594 64 252.718V36.103Z"
      />
    </g>
    <g filter="url(#b)">
      <path
        className="background-color"
        d="M44 54.564c0-12.235 9.919-22.154 22.154-22.154h258.692C337.081 32.41 347 42.33 347 54.564v243.692c0 12.236-9.919 22.154-22.154 22.154H66.154C53.919 320.41 44 310.492 44 298.256V54.564Z"
      />
    </g>
    <g filter="url(#c)">
      <path
        className="background-color"
        d="M24 68.41c0-11.045 8.954-20 20-20h303c11.046 0 20 8.955 20 20v272c0 11.046-8.954 20-20 20H44c-11.046 0-20-8.954-20-20v-272Z"
      />
      <path
        className="sub-logo-color"
        d="m70.57 91.9 7.071-7.07-1.767-1.768c-3.536-3.536-7.072-3.536-10.607 0l-1.768 1.768 7.071 7.07Z"
      />
      <path
        className="main-logo-color"
        d="M77.641 102.507c-.781.803-14.142 14.142-14.142 14.142l1.768 1.768c1.768 1.768 7.07 3.536 10.606 0l14.143-14.142c1.767-1.768 1.767-5.303 0-7.07l-8.84-8.84-7.07 7.071 3.535 3.536c.884.884.782 2.733 0 3.535Z"
      />
      <rect
        width={136}
        height={32}
        x={199}
        y={84.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={16}
      />
      <rect
        width={95}
        height={24}
        x={56}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={45}
        height={24}
        x={167}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={46}
        height={24}
        x={228}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={45}
        height={24}
        x={290}
        y={152.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={101}
        height={24}
        x={56}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={26}
        height={24}
        x={173}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={120}
        height={24}
        x={215}
        y={192.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={57.75}
        height={24}
        x={56}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={57.75}
        height={24}
        x={129.75}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={57.75}
        height={24}
        x={203.5}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={57.75}
        height={24}
        x={277.25}
        y={232.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={43}
        height={24}
        x={56}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={43}
        height={24}
        x={115}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={43}
        height={24}
        x={174}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={43}
        height={24}
        x={233}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
      <rect
        width={43}
        height={24}
        x={292}
        y={272.41}
        className="primary-text-color"
        fillOpacity={0.04}
        rx={12}
      />
    </g>
    <defs>
      <filter
        id="a"
        width={302.385}
        height={295.385}
        x={44.308}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={3.282} />
        <feGaussianBlur stdDeviation={9.846} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_11_819" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_11_819"
          result="shape"
        />
      </filter>
      <filter
        id="b"
        width={347.308}
        height={332.308}
        x={21.846}
        y={13.949}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={3.692} />
        <feGaussianBlur stdDeviation={11.077} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_11_819" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_11_819"
          result="shape"
        />
      </filter>
      <filter
        id="c"
        width={391}
        height={360}
        x={0}
        y={28.41}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_11_819" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_11_819"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const WrappedNewsletterHeroIllustration = (
  props: NewsletterHeroIllustrationProps,
) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <IllustrationWrapper>
      {isDesktop ? (
        <NewsletterHeroDesktopIllustration {...props} />
      ) : (
        <NewsletterHeroMobileIllustration {...props} />
      )}
    </IllustrationWrapper>
  );
};

export default WrappedNewsletterHeroIllustration;
