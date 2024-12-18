import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { Button } from 'src/components/Button';
import { JUMPER_FEST_PATH } from 'src/const/urls';
import { SoraTypography } from '../../Superfest.style';
import { BackButtonMainBox } from './BackButton.style';

// todo: cleanup and use one single BackButton component
export const BackButton = () => {
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
        <SoraTypography
          fontSize="14px"
          lineHeight="14px"
          fontWeight={500}
          marginLeft={'8px'}
        >
          {String('SUPERFEST').toUpperCase()}
        </SoraTypography>
      </Button>
    </BackButtonMainBox>
  );
};
