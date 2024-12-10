import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { BackButtonStyles } from './BackButton.style';

interface BackButtonProps {
  path?: string;
  title?: string;
}

export const BackButton = ({ path, title }: BackButtonProps) => {
  const { t } = useTranslation();

  return (
    <Link
      href={path ?? JUMPER_LOYALTY_PATH}
      style={{ textDecoration: 'none', width: 168, display: 'block' }}
    >
      <BackButtonStyles size={'large'}>
        <ArrowBackIcon
          sx={{ color: '#FFFFFF', width: '16px', height: '16px' }}
        />
        <Typography
          fontSize="14px"
          lineHeight="14px"
          fontWeight={500}
          marginLeft={'8px'}
        >
          {(
            title ||
            t('navbar.navbarMenu.profile') ||
            'Jumper Profile'
          ).toUpperCase()}
        </Typography>
      </BackButtonStyles>
    </Link>
  );
};
