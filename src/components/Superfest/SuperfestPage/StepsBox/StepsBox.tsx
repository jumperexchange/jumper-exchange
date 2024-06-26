import { Button } from 'src/components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { JUMPER_FEST } from 'src/const/urls';
import {
  LeftTextBox,
  SuperfestPageElementContainer,
} from '../SuperfestMissionPage.style';
import { Typography } from '@mui/material';
import { sequel85 } from 'src/fonts/fonts';
import { CustomRichBlocks } from 'src/components/Blog';
import { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';

interface StepsBoxProps {
  steps?: RootNode[];
  baseUrl: string;
}

export const StepsBox = ({ steps, baseUrl }: StepsBoxProps) => {
  return (
    <SuperfestPageElementContainer>
      <LeftTextBox>
        <Typography
          sx={{
            typography: sequel85.style.fontFamily,
            fontSize: '32px',
            fontWeight: 700,
          }}
        >
          Steps to complete the mission
        </Typography>
      </LeftTextBox>
      <>
        <CustomRichBlocks
          id={1}
          baseUrl={baseUrl}
          content={steps}
          activeTheme={'superfest'}
        />
      </>
    </SuperfestPageElementContainer>
  );
};
