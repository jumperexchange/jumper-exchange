import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Link, Slide, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export const FeatureCard = ({ title, subtitle }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  return (
    <Slide direction="up" in={open} unmountOnExit appear={false} timeout={400}>
      <Card
        sx={{
          width: 384,
          height: 160,
          borderRadius: '12px',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? '#20223D'
              : theme.palette.white.main,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
              : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ padding: theme.spacing(6), position: 'relative' }}>
          <IconButton
            disableRipple={true}
            sx={{
              position: 'absolute',
              right: theme.spacing(2),
              top: theme.spacing(2),
              // '&:hover': {
              //   backgroundColor: getContrastAlphaColor(theme, '4%'),
              // },
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

          <Typography
            variant={'lifiHeaderSmall'}
            sx={{
              fontSize: '24px',
              lineHeight: '32px',
            }}
            gutterBottom
          >
            {title}
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
            {subtitle}
          </Typography>
          <CardActions sx={{ padding: 0, marginTop: theme.spacing(2) }}>
            <Link href={'https://li.fi'} sx={{ textDecoration: 'none' }}>
              <Typography variant="lifiBodySmallStrong">Learn more</Typography>
            </Link>
          </CardActions>
        </CardContent>
      </Card>
    </Slide>
  );
};
