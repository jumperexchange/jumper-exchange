import { Breakpoint, Slide, Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StatsCards } from '../StatsCard';
import { ContentContainer, CustomColor, Wrapper } from './WelcomeWrapper.style';
interface WelcomeWrapperProps {
  children: JSX.Element;
  showWelcome: boolean;
  handleGetStarted: (event: any) => void;
}

export const WelcomeWrapper = ({
  children,
  showWelcome,
  handleGetStarted,
}: WelcomeWrapperProps) => {
  const theme = useTheme();
  const i18Path = 'navbar.welcome.';
  const { t: translate } = useTranslation();
  const [openChainsPopper, setOpenChainsPopper] = useState(false);
  const [openBridgesPopper, setOpenBridgesPopper] = useState(false);
  const [openDexsPopper, setOpenDexsPopper] = useState(false);

  return (
    <Wrapper showWelcome={showWelcome || false}>
      {children}
      <Slide
        direction="up"
        unmountOnExit
        appear={false}
        timeout={400}
        in={showWelcome}
      >
        <ContentContainer showWelcome={showWelcome}>
          <CustomColor variant={'lifiHeaderMedium'}>
            {translate(`${i18Path}title`)}
          </CustomColor>
          <Typography
            variant={'lifiBodyLarge'}
            sx={{
              marginTop: theme.spacing(4),
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.accent1Alt.main
                  : theme.palette.primary.main,
              '& > .link-lifi': {
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              },
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                fontSize: '24px',
                fontWeight: 400,
                lineHeight: '32px',
              },
            }}
          >
            {
              <Trans
                i18nKey={`${i18Path}subtitle`}
                components={[
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    className={'link-lifi'}
                    href="https://docs.li.fi/smart-contracts/audits"
                    target={'_blank'}
                    rel="noreferrer"
                  />,
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    className={'link-lifi'}
                    href="https://li.fi"
                    target={'_blank'}
                    rel="noreferrer"
                  />,
                ]}
              />
            }
          </Typography>
          <StatsCards
            openChainsPopper={openChainsPopper}
            setOpenChainsPopper={setOpenChainsPopper}
            openBridgesPopper={openBridgesPopper}
            setOpenBridgesPopper={setOpenBridgesPopper}
            openDexsPopper={openDexsPopper}
            setOpenDexsPopper={setOpenDexsPopper}
          />
          <ButtonPrimary
            onClick={handleGetStarted}
            sx={(theme) => ({
              margin: 'auto',
              marginTop: theme.spacing(8),
              height: '48px',
              width: '192px',
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                marginTop: theme.spacing(12),
                height: '56px',
                borderRadius: '28px',
                width: '247px',
              },
            })}
          >
            <Typography
              variant={'lifiBodyMediumStrong'}
              sx={{
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  fontSize: '18px',
                  lineHeight: '24px',
                },
              }}
            >
              {translate(`${i18Path}cta`)}
            </Typography>
          </ButtonPrimary>
        </ContentContainer>
      </Slide>
    </Wrapper>
  );
};
