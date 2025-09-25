import { FC, useState, useEffect } from 'react';
import {
  IconSelectContainer,
  StyledToggleButtonGroup,
  StyledToggleButton,
  StyledIconButton,
  IconWrapper,
  IconLabel,
} from './IconSelect.styles';
import { IconSelectProps } from './IconSelect.types';
import Tooltip from '@mui/material/Tooltip';

export const IconSelect: FC<IconSelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  size = 'medium',
  spacing = 1,
  columns,
  showLabel = false,
  showTooltip = true,
  disabled = false,
  color = 'primary',
  selectionMode = 'toggle',
  variant = 'outlined',
  fullWidth = false,
  className,
  orientation = 'horizontal',
  'data-testid': dataTestId,
}) => {
  const [selectedValues, setSelectedValues] = useState<string | string[]>(
    multiple ? (value as string[]) || [] : (value as string) || '',
  );

  useEffect(() => {
    setSelectedValues(
      multiple ? (value as string[]) || [] : (value as string) || '',
    );
  }, [value, multiple]);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | string[],
  ) => {
    if (newValue !== null) {
      setSelectedValues(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleIconClick = (optionValue: string) => {
    if (disabled) return;

    if (multiple) {
      const currentValues = selectedValues as string[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    } else {
      const newValue =
        selectionMode === 'radio' || selectedValues !== optionValue
          ? optionValue
          : '';
      setSelectedValues(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return (selectedValues as string[]).includes(optionValue);
    }
    return selectedValues === optionValue;
  };

  const renderIcon = (option: any) => {
    const iconContent = (
      <IconWrapper>
        {option.icon}
        {showLabel && option.label && <IconLabel>{option.label}</IconLabel>}
      </IconWrapper>
    );

    return showTooltip && option.tooltip ? (
      <Tooltip title={option.tooltip} arrow>
        {iconContent}
      </Tooltip>
    ) : (
      iconContent
    );
  };

  const buttonSizeProps = getButtonSize(size);

  if (selectionMode === 'toggle') {
    return (
      <StyledToggleButtonGroup
        value={selectedValues}
        onChange={handleToggleChange}
        exclusive={!multiple}
        className={className}
        disabled={disabled}
        orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
        data-testid={dataTestId}
      >
        {options.map((option) => (
          <StyledToggleButton
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            selectedColor={color}
            variant={variant}
            sx={{
              ...buttonSizeProps,
              color: option.color || undefined,
            }}
            data-testid={
              dataTestId ? `${dataTestId}-${option.value}` : undefined
            }
          >
            {renderIcon(option)}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    );
  }

  return (
    <IconSelectContainer
      orientation={orientation}
      columns={columns}
      fullWidth={fullWidth}
      className={className}
      sx={{ gap: spacing }}
      data-testid={dataTestId}
    >
      {options.map((option) => (
        <StyledIconButton
          key={option.value}
          onClick={() => handleIconClick(option.value)}
          disabled={disabled || option.disabled}
          isSelected={isSelected(option.value)}
          selectedColor={color}
          variant={variant}
          size={size}
          sx={{
            ...buttonSizeProps,
            color: option.color || undefined,
          }}
          data-testid={dataTestId ? `${dataTestId}-${option.value}` : undefined}
        >
          {renderIcon(option)}
        </StyledIconButton>
      ))}
    </IconSelectContainer>
  );
};

function getButtonSize(size: 'small' | 'medium' | 'large') {
  switch (size) {
    case 'small':
      return {
        width: 40,
        height: 40,
        '& svg': { fontSize: '1.25rem' },
      };
    case 'large':
      return {
        width: 64,
        height: 64,
        '& svg': { fontSize: '2rem' },
      };
    case 'medium':
    default:
      return {
        width: 48,
        height: 48,
        '& svg': { fontSize: '1.5rem' },
      };
  }
}
