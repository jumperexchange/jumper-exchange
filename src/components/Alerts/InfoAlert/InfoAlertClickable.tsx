import {
  InfoMessageCard,
  InfoMessageCardTitle,
} from '@/components/MessageCard';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { Slide, Typography, darken, lighten, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { InfoAlertButton, InfoAlertContainer } from '.';
import { Button } from 'src/components/Button';

export interface InfoAlertProps {
  title: string;
  subtitle: string;
  active: boolean;
  buttonText: string;
}

export const InfoAlertClickable = ({
  title,
  subtitle,
  active,
  buttonText,
}: InfoAlertProps) => {
  const [closed, setClosed] = useState(false);
  const theme = useTheme();
  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setClosed(true);
  };

  useEffect(() => {
    active && setClosed(false);
  }, [active]);

  return (
    <Slide
      direction="up"
      in={!closed && active}
      unmountOnExit
      appear={!closed && active}
      timeout={500}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <InfoAlertContainer>
        <a
          href="https://app.sei.io/"
          target="_blank"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <InfoMessageCard
            mt={theme.spacing(4)}
            mb={theme.spacing(4)}
            sx={{ cursor: 'pointer' }}
          >
            <InfoAlertButton onClick={(e) => handleClose(e)}>
              <CloseIcon
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </InfoAlertButton>
            <InfoMessageCardTitle
              display="flex"
              alignItems="center"
              px={2}
              pt={2}
            >
              <InfoIcon
                sx={{
                  marginRight: 1,
                }}
              />
              <Typography variant={'lifiHeaderXSmall'}>{title}</Typography>
            </InfoMessageCardTitle>
            <Typography variant={'lifiBodySmall'} pt={theme.spacing(1.5)}>
              {subtitle}
            </Typography>
            <Button
              size="small"
              styles={{
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? darken(theme.palette.info.main, 0.2)
                    : lighten(theme.palette.info.main, 0.1),
                padding: 2,
                marginTop: theme.spacing(1.5),
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: theme.palette.info.main,
                },
              }}
            >
              <Typography variant={'lifiBodySmall'}>{buttonText}</Typography>
            </Button>
          </InfoMessageCard>
        </a>
      </InfoAlertContainer>
    </Slide>
  );
};
