import { useWallet } from '@lifi/widget';
import { useTheme } from '@mui/material';
import { Button } from 'src/components';
import { LogoLink } from '../Navbar';

import { useTranslation } from 'react-i18next';
import { Discord, Logo } from 'src/components';
import { getContrastAlphaColor } from 'src/utils';
import {
  CenteredContainer,
  DiscordText,
  ErrorMessage,
  NavbarContainer,
} from './ErrorBoundary.style';

export const ErrorBoundary = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { account } = useWallet();
  return (
    <>
      <NavbarContainer>
        <LogoLink>
          <Logo isConnected={!!account.address} theme={theme} />
        </LogoLink>
      </NavbarContainer>
      <CenteredContainer>
        <ErrorMessage variant={'lifiBodyLarge'}>
          {t('error.message')}
        </ErrorMessage>
        <Button
          variant="primary"
          styles={{
            width: 'auto',
            margin: '12px',
            gap: '8px',
            borderRadius: '24px',
            padding: '8px',
            '> button:hover': {
              backgroundColor: getContrastAlphaColor(theme, '4%'),
            },
            '> button:hover svg': {
              fill:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300],
            },
          }}
          fullWidth={true}
        >
          <Discord
            color={
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : theme.palette.black.main
            }
          />
          <DiscordText variant="lifiBodyMediumStrong" component="span">
            Discord
          </DiscordText>
        </Button>
      </CenteredContainer>
    </>
  );
};
