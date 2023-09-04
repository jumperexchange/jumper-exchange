import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Link, Slide, useTheme } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores';

import {
  FeatureCardAsset,
  FeatureCardType,
} from '../../types/featureCardsRequest';
import { Card, CardImage } from './FeatureCard.style';

interface FeatureCardProps {
  data: FeatureCardType;
  isSuccess: boolean;
  assets: FeatureCardAsset[];
}

export const FeatureCard = ({ data, isSuccess, assets }: FeatureCardProps) => {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const [onDisableFeatureCard] = useSettingsStore((state) => [
    state.onDisableFeatureCard,
  ]);
  const theme = useTheme();
  useEffect(() => {
    data?.fields?.displayConditions &&
      data?.fields?.displayConditions.showOnce &&
      onDisableFeatureCard(data?.fields?.displayConditions?.id);
  }, [data?.fields?.displayConditions, onDisableFeatureCard]);

  const imageUrl = useMemo(() => {
    return assets.filter((el: FeatureCardAsset) => {
      return theme.palette.mode === 'dark'
        ? el?.sys?.id === data?.fields?.imageDarkMode?.sys?.id
        : el?.sys?.id === data?.fields?.imageLightMode?.sys?.id;
    })[0]?.fields?.file?.url;
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
      appear={true}
      timeout={150}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <Card gradient={data?.fields.gradientColor || undefined}>
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
              !data?.fields?.displayConditions?.hasOwnProperty('showOnce') &&
                !!data?.fields?.displayConditions?.id &&
                onDisableFeatureCard(data?.fields?.displayConditions?.id);
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
          {!!data?.fields?.title && (
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
          )}
          {!!data?.fields?.subtitle && (
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
          )}
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
                {t('featureCard.learnMore')}
              </Typography>
            </Link>
          </CardActions>
          {imageUrl && (
            <CardImage
              component="img"
              src={imageUrl}
              alt="Feature Card Image"
            />
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};
