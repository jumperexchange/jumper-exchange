import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Button } from 'src/components/Button';
import { JUMPER_FEST_PATH } from 'src/const/urls';
import { BackButtonMainBox } from './BackButton.style';

export const BackButton = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <BackButtonMainBox>
      <Button
        size={'large'}
        styles={{
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
        onClick={() => {
          router.push(JUMPER_FEST_PATH);
        }}
      >
        <ArrowBackIcon
          sx={{ color: '#FFFFFF', width: '16px', height: '16px' }}
        />
        <Typography
          variant="bodySmall"
          lineHeight="14px"
          fontWeight={500}
          marginLeft={'8px'}
        >
          {String(title).toUpperCase()}
        </Typography>
      </Button>
    </BackButtonMainBox>
  );
};
