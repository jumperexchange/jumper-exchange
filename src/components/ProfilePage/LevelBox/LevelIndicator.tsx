import { LevelButton } from '../../Button';
import { NoSelectTypography } from '../ProfilePage.style';
import { XPIcon } from '../../illustrations/XPIcon';

interface LevelButtonProps {
  level: number;
  points: number;
}

export const LevelIndicator = ({ level, points }: LevelButtonProps) => {
  return (
    <LevelButton aria-label="XP Level" size="medium">
      <NoSelectTypography
        fontSize="12px"
        lineHeight="16px"
        fontWeight={600}
        marginRight="8px"
      >
        LEVEL {level} • {points}
      </NoSelectTypography>
      <XPIcon size={16} />
    </LevelButton>
  );
};
