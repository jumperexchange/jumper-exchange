'use client';
import { Widget } from '@/components/Widgets/Widget';
import { Container } from '@mui/material';
import { WidgetContainer, Widgets } from 'src/components/Widgets';

// custom widget-config setting via partner-theme

export default function Page() {
  return (
    <Container>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widget starterVariant="default" />
        <Widgets widgetVariant={'default'} />
      </WidgetContainer>
    </Container>
  );
}
