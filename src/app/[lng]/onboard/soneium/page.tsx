'use client';
import { Widget } from '@/components/Widgets/Widget';
import { WidgetContainer } from '@/components/Widgets/Widgets.style';
import { Container } from '@mui/material';
import { Widgets } from 'src/components/Widgets/Widgets';

// custom widget-config setting via partner-theme

export default function Page() {
  return (
    <Container>
      <WidgetContainer
        welcomeScreenClosed={true}
        sx={(theme) => ({
          [theme.breakpoints.up('lg')]: {
            paddingTop: theme.spacing(3.5),
            // REMOVE extra marginRight-spacing of 56px (width of navbar-tabs + gap) needed to center properly while welcome-screen is closed
            margin: `auto`,
          },
        })}
      >
        <Widget starterVariant="default" />
        <Widgets widgetVariant={'default'} />
      </WidgetContainer>
    </Container>
  );
}
