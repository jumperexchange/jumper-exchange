import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { BackButtonMainBox } from './BackButton.style';

interface BackButtonProps {
  path: string;
  title?: string;
}

export const BackButton = ({ path, title }: BackButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <BackButtonMainBox>
      <Button
        size={'large'}
        styles={{
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
        onClick={() => {
          router.push(path);
        }}
      >
        <ArrowBackIcon
          sx={(theme) => ({
            color: theme.palette.white.main,
            width: '16px',
            height: '16px',
          })}
        />
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '14px',
            fontWeight: 500,
            marginLeft: '8px',
          }}
        >
          {String(
            title || 'Profile' || t('navbar.navbarMenu.profile'),
          ).toUpperCase()}
        </Typography>
      </Button>
    </BackButtonMainBox>
  );
};
