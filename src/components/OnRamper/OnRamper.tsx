'use client';
import { WidgetWrapper } from '@/components/Widgets';
import { removeHash } from '@/utils/removeHash';
import { useTheme } from '@mui/material';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { OnRamperIFrame } from './index';

interface OnRamplerProps {
  isWelcomeScreenClosed?: boolean;
  activeTheme?: string;
}

export const OnRamper = ({
  isWelcomeScreenClosed,
  activeTheme,
}: OnRamplerProps) => {
  const theme = useTheme();
  const { welcomeScreenClosed } = useWelcomeScreen(
    isWelcomeScreenClosed,
    activeTheme,
  );
  const onRamperConfig = {
    apiKey: process.env.NEXT_PUBLIC_ONRAMPER_API_KEY,
    defaultCrypto: 'ETH',
    themeName: theme.palette.mode === 'light' ? 'light' : 'dark',
    containerColor: removeHash(theme.palette.surface1.main),
    background: removeHash(theme.palette.surface1.main),
    primaryColor: removeHash(theme.palette.primary.main),
    secondaryColor: removeHash(
      theme.palette.mode === 'light' ? theme.palette.grey[100] : '#302B52',
    ),
    cardColor: removeHash(theme.palette.surface2.main),
    primaryTextColor: removeHash(theme.palette.text.primary),
    secondaryTextColor: removeHash(
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.white.main,
    ),
    borderRadius: 0.75,
    wgBorderRadius: 1.5,
  };

  const searchParams = new URLSearchParams(
    Object.entries(onRamperConfig).map(([key, value]) => [key, String(value)]),
  );
  const onRamperSrc = `https://buy.onramper.com/?${searchParams.toString()}`;

  return (
    <WidgetWrapper
      welcomeScreenClosed={welcomeScreenClosed}
      className="widget-wrapper"
    >
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <OnRamperIFrame
          src={onRamperSrc}
          height="630px"
          width="416px"
          title="Onramper widget"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        ></OnRamperIFrame>
      </div>
    </WidgetWrapper>
  );
};
