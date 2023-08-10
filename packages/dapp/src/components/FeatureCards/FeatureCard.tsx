import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Link, Slide, useTheme } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores';
import { Card, CardImage } from './FeatureCard.style';

export const FeatureCard = ({ data, isSuccess, assets }) => {
  const [open, setOpen] = useState(true);
  const { t: translate } = useTranslation();
  const [onDisableFeatureCard] = useSettingsStore((state) => [
    state.onDisableFeatureCard,
  ]);
  const i18Path = 'featureCard.';
  const theme = useTheme();

  useEffect(() => {
    data?.fields?.displayConditions &&
      data?.fields?.displayConditions[0]?.showOnce &&
      onDisableFeatureCard(data?.fields?.displayConditions[0]?.id);
  }, [data?.fields?.displayConditions, onDisableFeatureCard]);

  const imageUrl = useMemo(() => {
    return assets.filter((el) => {
      return theme.palette.mode === 'dark'
        ? el?.sys?.id === data?.fields?.imageDarkMode?.sys?.id
        : el?.sys?.id === data?.fields?.imageLightMode?.sys?.id;
    })[0].fields?.file?.url;
  }, [
    theme.palette.mode,
    assets,
    data?.fields?.imageDarkMode?.sys?.id,
    data?.fields?.imageLightMode?.sys?.id,
  ]);

  return (
    <Slide
      direction="up"
      in={open}
      unmountOnExit
      appear={false}
      timeout={150}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <Card gradient={data?.gradientColor} className="test">
        <CardContent
          sx={{
            padding: theme.spacing(6),
            position: 'relative',
          }}
        >
          <IconButton
            disableRipple={true}
            sx={{
              position: 'absolute',
              right: theme.spacing(2),
              top: theme.spacing(2),
            }}
            onClick={() => {
              setOpen(false);
              !data?.fields?.displayConditions[0].hasOwnProperty('showOnce') &&
                !!data?.fields?.displayConditions[0]?.id &&
                onDisableFeatureCard(data?.fields?.displayConditions[0]?.id);
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
          <Typography
            variant={'lifiHeaderSmall'}
            sx={{
              fontSize: '24px',
              lineHeight: '32px',
            }}
            gutterBottom
          >
            {data?.fields?.title}
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
            {data?.fields?.subtitle}
          </Typography>
          <CardActions sx={{ padding: 0, marginTop: theme.spacing(2) }}>
            <Link
              target="_blank"
              rel="noopener"
              href={data?.fields?.url || 'https://li.fi'}
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
          <CardImage component="img" src={imageUrl} alt="Feature Card Image" />
        </CardContent>
      </Card>
    </Slide>
  );
};
