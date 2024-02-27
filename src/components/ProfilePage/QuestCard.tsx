import { Container, Stack, Typography, useTheme } from '@mui/material';
import { useUserTracking } from 'src/hooks';

export const QuestCard = ({ active, title, image, points }: any) => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

  return (
    <Container
      sx={{
        backgroundColor: '#FFFFFF',
        height: '320px',
        width: '272px',
        borderRadius: '24px',
      }}
    >
      <img src={image} width={'200px'} height={'200px'} />

      <Container>
        <Typography> {title}</Typography>
      </Container>
      <Stack direction={'row'} spacing={1}>
        <Typography> +{points}</Typography>
        {active ? <Typography> Join</Typography> : null}
      </Stack>
    </Container>
  );
};
