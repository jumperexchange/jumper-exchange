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
          marginBottom={2}
          textAlign="center"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontSize: { xs: '40px', sm: '40px' },
          })}
        >
          Bridge tokens to your Abstract Wallet
        </Typography>

        <WidgetContainer welcomeScreenClosed={true}>
          <Widget starterVariant="default" />
          <Widgets widgetVariant={'default'} />
        </WidgetContainer>
      </Stack>
    </Container>
  );
}
