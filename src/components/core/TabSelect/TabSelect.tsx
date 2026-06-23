import type { FC, SyntheticEvent } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  StyledTabs,
  StyledTab,
  TabContainer,
  StyledBadge,
  IconWrapper,
} from './TabSelect.styles';
import type { TabSelectProps, TabOption } from './TabSelect.types';

export const TabSelect: FC<TabSelectProps> = ({
  options,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'standard',
  centered = false,
  indicatorColor = 'primary',
  textColor = 'primary',
  disabled = false,
  size = 'medium',
  showBorder = false,
  scrollButtons = 'auto',
  allowScrollButtonsMobile = false,
  iconPosition = 'start',
  wrapped = false,
  className,
  ariaLabel = 'tab selection',
  'data-testid': dataTestId,
}) => {
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const currentValue = value || (options.length > 0 ? options[0].value : '');

  const renderTabLabel = (option: TabOption) => {
    const icon = option.icon ? <IconWrapper>{option.icon}</IconWrapper> : null;
    const label = <span>{option.label}</span>;

    let content: React.ReactNode;
    if (!icon) {
      content = option.badge ? (
        <StyledBadge badgeContent={option.badge}>{label}</StyledBadge>
      ) : (
        label
      );
    } else {
      const iconAndLabel = (
        <>
          {iconPosition === 'start' || iconPosition === 'top' ? icon : null}
          {label}
          {iconPosition === 'end' || iconPosition === 'bottom' ? icon : null}
        </>
      );
      content = option.badge ? (
        <StyledBadge badgeContent={option.badge}>{iconAndLabel}</StyledBadge>
      ) : (
        iconAndLabel
      );
    }

    if (option.tooltip) {
      return (
        <Tooltip title={option.tooltip} arrow>
          <span>{content}</span>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TabContainer className={className}>
      <StyledTabs
        value={currentValue}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        centered={centered && variant !== 'scrollable'}
        indicatorColor={indicatorColor}
        textColor={textColor}
        showBorder={showBorder}
        size={size}
        scrollButtons={scrollButtons}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        aria-label={ariaLabel}
        data-testid={dataTestId}
      >
        {options.map((option) => (
          <StyledTab
            key={option.value}
            value={option.value}
            label={renderTabLabel(option)}
            disabled={disabled || option.disabled}
            wrapped={wrapped}
            size={size}
            data-testid={
              dataTestId ? `${dataTestId}-${option.value}` : undefined
            }
            disableRipple
            iconPosition={
              iconPosition === 'top' || iconPosition === 'bottom'
                ? iconPosition
                : undefined
            }
          />
        ))}
      </StyledTabs>
    </TabContainer>
  );
};
