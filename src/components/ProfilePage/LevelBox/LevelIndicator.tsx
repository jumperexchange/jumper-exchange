import { LevelButton } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';
import { NoSelectTypography } from '../ProfilePage.style';

interface LevelButtonProps {
  level: number;
  bound: number;
}

export const LevelIndicator = ({ level, bound }: LevelButtonProps) => {
  return (
    <LevelButton aria-label="XP Level" size="medium">
      <NoSelectTypography
        fontSize="12px"
        lineHeight="16px"
        fontWeight={600}
        marginRight="8px"
      >
        LEVEL {level} • {bound}
      </NoSelectTypography>
      <XPIcon size={16} />
    </LevelButton>
  );
};
