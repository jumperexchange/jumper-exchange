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
  const widgetStyling = {
    themeName: theme.palette.mode === 'light' ? 'light' : 'dark',
    containerColor: removeHash(theme.palette.surface1.main),
    background: removeHash(theme.palette.surface1.main),
    primaryColor: removeHash(theme.palette.primary.main),
    secondaryColor: removeHash(
      theme.palette.mode === 'dark' ? '#302B52' : theme.palette.grey[100],
    ),
    cardColor: removeHash(theme.palette.surface2.main),
    primaryTextColor: removeHash(
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.white.main,
    ),
    secondaryTextColor:
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.white.main,
    borderRadius: 30,
    wgBorderRadius: '12px',
    border: 'unset',
  };
  const regex = /"([^"]+)":"([^"]+)"(,?)/g;
  const outputString = JSON.stringify(widgetStyling)
    .replace(regex, '$1=$2&')
    .slice(0, -1)
    .substring(1);

  return (
    <OnRamperIFrame
      src={`https://buy.onramper.com/?apiKey=${
        import.meta.env.VITE_ONRAMPER_API_KEY
      }?defaultCrypto=ETH?excludeCryptos=BTC?${outputString}`}
      height="540px"
      width="392px"
      title="Onramper widget"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    ></OnRamperIFrame>
  );
};
