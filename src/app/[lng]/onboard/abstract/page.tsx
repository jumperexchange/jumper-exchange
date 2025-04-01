'use client';
import { Widget } from '@/components/Widgets/Widget';
import { Container, Stack, Typography } from '@mui/material';
import { WidgetContainer, Widgets } from 'src/components/Widgets';

export default function Page() {
  return (
    <Container>
      <Stack display="flex" alignItems="center" direction="column">
        <Typography
          variant="h1"
          sx={(theme) => ({
            textAlign: 'center',
            color: theme.palette.text.primary,
            fontSize: { xs: '40px', sm: '40px' },
          })}
        >
          Bridge tokens to your Abstract Wallet
        </Typography>

        <WidgetContainer
          welcomeScreenClosed={true}
          sx={(theme) => ({
            paddingTop: theme.spacing(3.5),
            [theme.breakpoints.up('lg')]: {
              // REMOVE extra marginRight-spacing of 56px (width of navbar-tabs + gap) needed to center properly while welcome-screen is closed
              margin: `auto`,
            },
          })}
        >
          <Widget starterVariant="default" />
          <Widgets widgetVariant={'default'} />
        </WidgetContainer>
      </Stack>
    </Container>
  );
}
