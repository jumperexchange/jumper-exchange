import { ChainId } from '@lifi/sdk';
import { useTheme } from '@mui/material';
import { useWallet } from '../../providers/WalletProvider';
import { OnRamperIFrame } from './index';

function removeHash(str) {
  if (str.startsWith('#')) {
    return str.substring(1);
  }
  return str;
}

export const OnRamper = () => {
  const { account } = useWallet();
  const theme = useTheme();

  const onRamperConfig = {
    defaultCrypto: ChainId[account.chainId],
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
    borderRadius: 2,
    wgBorderRadius: 1.5,
  };
  const onRamperSrc = `https://buy.onramper.com/?themeName=${
    onRamperConfig.themeName
  }&containerColor=${onRamperConfig.containerColor}&primaryColor=${
    onRamperConfig.primaryColor
  }&secondaryColor=${onRamperConfig.secondaryColor}&cardColor=${
    onRamperConfig.cardColor
  }&primaryTextColor=${onRamperConfig.primaryTextColor}&secondaryTextColor=${
    onRamperConfig.secondaryTextColor
  }&borderRadius=${onRamperConfig.borderRadius}&wgBorderRadius=${
    onRamperConfig.wgBorderRadius
  }?apiKey=${import.meta.env.VITE_ONRAMPER_API_KEY}&defaultCrypto=${
    !!onRamperConfig.defaultCrypto ? onRamperConfig.defaultCrypto : 'ETH'
  }`;
  return (
    <OnRamperIFrame
      src={onRamperSrc}
      height="540px"
      width="392px"
      title="Onramper widget"
      allow="accelerometer; autoplay; gyroscope; payment"
    ></OnRamperIFrame>
  );
};
