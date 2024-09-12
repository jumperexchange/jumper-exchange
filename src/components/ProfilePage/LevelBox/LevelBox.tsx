import { Box } from '@mui/material';
import {
  NoSelectTypography,
  NoSelectTypographyTitle,
} from '../ProfilePage.style';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
interface LevelBoxProps {
  level?: number;
  loading: boolean;
}

export const LevelBox = ({ level }: LevelBoxProps) => {
  return (
    <Box>
      <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
        LEVEL
        <Tooltip
          title={t('profile_page.levelInfo')}
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
      <Box display="flex" justifyContent="end">
        <NoSelectTypographyTitle
          lineHeight={1.25}
          fontWeight={700}
          sx={{
            fontSize: { xs: 48, sm: 80 },
          }}
        >
          {level || '-'}
        </NoSelectTypographyTitle>
      </Box>
    </Box>
  );
};
