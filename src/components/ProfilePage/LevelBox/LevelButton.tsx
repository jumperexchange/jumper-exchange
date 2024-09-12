import { Button } from '../../../components/Button';
import { NoSelectTypography } from '../ProfilePage.style';
import { XPIcon } from '../../illustrations/XPIcon';

interface LevelButtonProps {
  level: number;
  points: number;
}

export const LevelButton = ({ level, points }: LevelButtonProps) => {
  return (
    <Button
      aria-label="Page Navigation"
      variant="secondary"
      size="medium"
      styles={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        paddingLeft: '12px',
        height: '32px',
      }}
    >
      <NoSelectTypography
        fontSize="12px"
        lineHeight="16px"
        fontWeight={600}
        marginRight="8px"
      >
        LEVEL {level} • {points}
      </NoSelectTypography>
      <XPIcon size={16} />
    </Button>
  );
};
