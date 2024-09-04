import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SoraTypography } from 'src/components/Superfest/Superfest.style';
import { LeftTextBox } from '../SuperfestMissionPage.style';
import { InformationBox } from './InformationAlertBox.style';

interface InformationAlertBoxProps {
  information?: string;
}

export const InformationAlertBox = ({
  information,
}: InformationAlertBoxProps) => {
  return (
    <InformationBox>
      <InfoOutlinedIcon sx={{ width: 32, height: 32 }} />
      <LeftTextBox ml="32px">
        <SoraTypography>{information}</SoraTypography>
      </LeftTextBox>
    </InformationBox>
  );
};
