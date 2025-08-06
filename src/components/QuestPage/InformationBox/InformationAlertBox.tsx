import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography } from '@mui/material';
import { LeftTextBox } from '../QuestsMissionPage.style';
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
        <Typography>{information}</Typography>
      </LeftTextBox>
    </InformationBox>
  );
};
