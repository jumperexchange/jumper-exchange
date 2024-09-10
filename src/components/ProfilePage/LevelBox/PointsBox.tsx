import { XpIconContainer } from '@/components/ProfilePage/LevelBox/PointsBox.style';
import { Box, Tooltip } from '@mui/material';
import { XPIcon } from '../../illustrations/XPIcon';
import {
  CenteredBox,
  NoSelectTypography,
  NoSelectTypographyTitle,
} from '../ProfilePage.style';
import InfoIcon from '@mui/icons-material/Info';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box>
      <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
        POINTS
        <Tooltip
          title={
            'Points is your score for interacting with Jumper. As you gain more points, your level goes up.'
          }
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <InfoIcon
            sx={{
              width: 16,
              height: 16,
              top: '3px',
              left: '8px',
              position: 'relative',
              opacity: '0.5',
            }}
          />
        </Tooltip>
      </NoSelectTypography>
      <CenteredBox>
        {points ? (
          <>
            <NoSelectTypographyTitle
              fontWeight={700}
              lineHeight={1.25}
              sx={{
                fontSize: { xs: 48, sm: 80 },
                letterSpacing: '-2px',
              }}
            >
              {points}
            </NoSelectTypographyTitle>
            <XpIconContainer>
              <XPIcon />
            </XpIconContainer>
          </>
        ) : (
          <>
            <NoSelectTypographyTitle
              fontWeight={700}
              lineHeight={1.25}
              sx={{
                fontSize: { xs: 48, sm: 80 },
                letterSpacing: '-2px',
              }}
            >
              {'-'}
            </NoSelectTypographyTitle>
          </>
        )}
      </CenteredBox>
    </Box>
  );
};
