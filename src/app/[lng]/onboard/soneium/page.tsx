'use client';
import { Widget } from '@/components/Widgets/Widget';
import { Container } from '@mui/material';
import { WidgetContainer, Widgets } from 'src/components/Widgets';

// additional widget-config setting via partner-theme
// --> hiddenUI={[HiddenUI.ToAddress]}

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
