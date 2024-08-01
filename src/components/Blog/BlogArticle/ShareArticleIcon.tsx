import { Tooltip, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { ShareButton } from './ShareArticleIcon.style';

interface ShareArticleIconProps {
  handleShare: () => void;
  tooltipMsg: string;
  icon: ReactNode;
  showMsg?: string;
  showMsgActive?: boolean;
}

export const ShareArticleIcon = ({
  handleShare,
  tooltipMsg,
  icon,
  showMsg,
  showMsgActive,
}: ShareArticleIconProps) => {
  return (
    <Tooltip
      title={tooltipMsg}
      open={showMsgActive ? false : undefined}
      disableFocusListener={showMsgActive ? false : undefined}
      disableInteractive={!showMsgActive ? false : undefined}
      placement="top"
      enterTouchDelay={0}
      arrow
    >
      <ShareButton onClick={handleShare} expanded={showMsgActive}>
        {icon}
        {showMsgActive && (
          <Typography variant="bodySmall" marginLeft={1} marginRight={1}>
            {showMsg}
          </Typography>
        )}
      </ShareButton>
    </Tooltip>
  );
};
