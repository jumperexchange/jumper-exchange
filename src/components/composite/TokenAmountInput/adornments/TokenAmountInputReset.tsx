import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import {
  Variant as IconButtonVariant,
  Size as IconButtonSize,
} from '@/components/core/buttons/types';

interface TokenAmountInputResetProps {
  onReset: () => void;
}

export const TokenAmountInputReset = ({
  onReset,
}: TokenAmountInputResetProps) => {
  return (
    <IconButton
      variant={IconButtonVariant.Default}
      size={IconButtonSize.MD}
      onClick={onReset}
    >
      <RefreshIcon />
    </IconButton>
  );
};
