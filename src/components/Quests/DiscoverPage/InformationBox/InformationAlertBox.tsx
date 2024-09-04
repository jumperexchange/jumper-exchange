import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography } from '@mui/material';
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
        {
          //* todo: check typography (sora) *//
        }
        <Typography
          variant="bodyMedium"
          fontWeight={400}
          lineHeight={'24px'}
          letterSpacing="0.15px"
        >
          {information}
        </Typography>{' '}
      </LeftTextBox>
    </InformationBox>
  );
};
