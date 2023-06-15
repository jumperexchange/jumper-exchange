import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Link, Slide, useTheme } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardImage } from './FeatureCard.style';

export const FeatureCard = ({ data, loading, error }) => {
  const [open, setOpen] = useState(true);
  const { t: translate } = useTranslation();
  const i18Path = 'featureCard.';
  const theme = useTheme();

  return (
    <Slide direction="up" in={open} unmountOnExit appear={false} timeout={400}>
      <Card gradient={data?.gradientColor}>
        <CardContent sx={{ padding: theme.spacing(6), position: 'relative' }}>
          <IconButton
            disableRipple={true}
            sx={{
              position: 'absolute',
              right: theme.spacing(2),
              top: theme.spacing(2),
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon
              sx={{
                width: '24px',
                height: '24px',
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.white.main
                    : theme.palette.black.main,
              }}
            />
          </IconButton>

          {loading && error ? (
            'loading'
          ) : (
            <>
              <Typography
                variant={'lifiHeaderSmall'}
                sx={{
                  fontSize: '24px',
                  lineHeight: '32px',
                }}
                gutterBottom
              >
                {data?.title}
              </Typography>
              <Typography
                variant={'lifiBodySmall'}
                sx={{
                  lineHeight: '24px',
                  width: '240px',
                  height: '48px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {data?.subtitle}
              </Typography>
              <CardActions sx={{ padding: 0, marginTop: theme.spacing(2) }}>
                <Link
                  href={data?.url || 'https://li.fi'}
                  sx={{
                    textDecoration: 'none',
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.accent1Alt.main
                        : theme.palette.primary.main,
                  }}
                >
                  <Typography variant="lifiBodySmallStrong">
                    {translate(`${i18Path}learnMore`)}
                  </Typography>
                </Link>
              </CardActions>
              <CardImage
                component="img"
                src={
                  theme.palette.mode === 'dark'
                    ? data?.imageDarkMode.url
                    : data?.imageLightMode.url
                }
                alt="Feature Card Image"
              />
            </>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};
