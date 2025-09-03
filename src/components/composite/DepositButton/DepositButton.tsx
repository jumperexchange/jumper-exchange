import { FC } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import {
  DepositButtonDisplayMode,
  DepositButtonProps,
} from './DepositButton.types';
import Box from '@mui/material/Box';
import {
  DepositButtonContentWrapper,
  DepositButtonLabelWrapper,
  DepositIcon,
} from './DepositButton.styles';

export const DepositButton: FC<DepositButtonProps> = ({
  displayMode = DepositButtonDisplayMode.IconAndLabel,
  size = 'medium',
  label,
  onClick,
  ...props
}) => {
  const showLabel = displayMode !== DepositButtonDisplayMode.IconOnly;
  const showIcon = displayMode !== DepositButtonDisplayMode.LabelOnly;
  const renderedIcon = <DepositIcon size={size} />;
  const renderedLabel = (
    <DepositButtonLabelWrapper>{label}</DepositButtonLabelWrapper>
  );

  return (
    <Button
      {...props}
      styles={{
        ...(props.styles || {}),
        minWidth: 'auto',
      }}
      variant="primary"
      onClick={onClick}
    >
      <DepositButtonContentWrapper>
        {showLabel && renderedLabel}
        {showIcon && renderedIcon}
      </DepositButtonContentWrapper>
    </Button>
  );
};
