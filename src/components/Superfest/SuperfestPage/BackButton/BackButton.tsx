import { Button } from 'src/components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { JUMPER_FEST_PATH } from 'src/const/urls';
import { BackButtonMainBox, ButtonTypography } from './BackButton.style';

export const BackButton = () => {
  const router = useRouter();

  return (
    <BackButtonMainBox>
      <Button
        size={'small'}
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
        <ButtonTypography>{'SUPERFEST'}</ButtonTypography>
      </Button>
    </BackButtonMainBox>
  );
};
