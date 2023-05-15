import { useTheme } from '@mui/material';
import { OnRamperIFrame } from './index';

function removeHash(str) {
  if (str.startsWith('#')) {
    return str.substring(1);
  }
  return str;
}

export const OnRamper = () => {
  const theme = useTheme();

  const onRamperConfig = {
    defaultCrypto: 'ETH',
    themeName: theme.palette.mode === 'light' ? 'light' : 'dark',
    containerColor: removeHash(theme.palette.surface1.main),
    background: removeHash(theme.palette.surface1.main),
    primaryColor: removeHash(theme.palette.primary.main),
    secondaryColor: removeHash(
      theme.palette.mode === 'light' ? theme.palette.grey[100] : '#302B52',
    ),
    cardColor: removeHash(theme.palette.surface2.main),
    primaryTextColor: removeHash(
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.white.main,
    ),
    secondaryTextColor: removeHash(
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.white.main,
    ),
    borderRadius: 0.75,
    wgBorderRadius: 1.5,
  };

  const searchParams = new URLSearchParams();
  searchParams.append('themeName', onRamperConfig.themeName);
  searchParams.append('defaultCrypto', onRamperConfig.defaultCrypto);
  searchParams.append('containerColor', onRamperConfig.containerColor);
  searchParams.append('primaryColor', onRamperConfig.primaryColor);
  searchParams.append('secondaryColor', onRamperConfig.secondaryColor);
  searchParams.append('cardColor', onRamperConfig.cardColor);
  searchParams.append('primaryTextColor', onRamperConfig.primaryTextColor);
  searchParams.append('secondaryTextColor', onRamperConfig.secondaryTextColor);
  searchParams.append('borderRadius', onRamperConfig.borderRadius.toString());
  searchParams.append(
    'wgBorderRadius',
    onRamperConfig.wgBorderRadius.toString(),
  );
  searchParams.append('apiKey', import.meta.env.VITE_ONRAMPER_API_KEY);

  const onRamperSrc = `https://buy.onramper.com/?${searchParams.toString()}`;

  return (
    <OnRamperIFrame
      src={onRamperSrc}
      height="540px"
      width="392px"
      title="Onramper widget"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    ></OnRamperIFrame>
  );
};
