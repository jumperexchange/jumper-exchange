import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { Button } from 'src/components/Button';
import { SoraTypography } from '../../Superfest.style';
import { BackButtonMainBox } from './BackButton.style';

interface BackButtonProps {
  path: string;
  title: string;
}

export const BackButton = ({ path, title }: BackButtonProps) => {
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
          router.push(path);
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
          {String(title).toUpperCase()}
        </SoraTypography>
      </Button>
    </BackButtonMainBox>
  );
};
