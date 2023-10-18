import { useTheme } from '@mui/material/styles';
import { HeaderLogo, HeaderManagement, Tabs } from 'src/components';
import { useWallet } from 'src/providers';
import { useSettingsStore } from 'src/stores';
import { HeaderContainer as Container, HeaderLogoLink } from '.';

export const Header = () => {
  const theme = useTheme();
  const { account } = useWallet();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);

  const handleClick = () => {
    onWelcomeScreenClosed(false);
  };

  return (
    <Container>
      <HeaderLogoLink onClick={handleClick}>
        <HeaderLogo isConnected={!!account.address} theme={theme} />
      </HeaderLogoLink>
      <Tabs />
      <HeaderManagement />
    </Container>
  );
};
