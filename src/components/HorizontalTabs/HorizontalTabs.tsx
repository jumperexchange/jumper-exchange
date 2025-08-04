import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';
import {
  HorizontalTabContainer,
  HorizontalTabsContainer,
  HorizontalTabSize,
} from './HorizontalTabs.style';
export interface HorizontalTabItem {
  value: string;
  label?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  disabled?: boolean;
}

export interface HorizontalTabsProps {
  tabs: HorizontalTabItem[];
  onChange?: (event: React.SyntheticEvent, newValue: string) => void;
  value?: string;
  size?: HorizontalTabSize;
  sx?: SxProps<Theme>;
  renderContent?: (currentValue: string) => ReactNode;
  id?: string;
}

export const HorizontalTabs = ({
  tabs,
  onChange,
  value,
  size = HorizontalTabSize.LG,
  sx,
  renderContent,
  id,
}: HorizontalTabsProps) => {
  const [internalValue, setInternalValue] = useState(value ?? tabs[0]?.value);

  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setInternalValue(newValue);
    onChange?.(event, newValue);
  };

  return (
    <>
      <HorizontalTabsContainer
        value={internalValue}
        onChange={handleChange}
        sx={sx}
        id={id}
      >
        {tabs
          .filter((tab) => tab.label || tab.startAdornment || tab.endAdornment)
          .map((tab) => (
            <HorizontalTabContainer
              disabled={tab.disabled}
              value={tab.value}
              key={tab.value}
              disableRipple
              label={
                <>
                  {tab.startAdornment}
                  {tab.label}
                  {tab.endAdornment}
                </>
              }
              size={size}
              id={id ? `${id}-tab-${tab.value}` : undefined}
            />
          ))}
      </HorizontalTabsContainer>
      {!!renderContent && renderContent(internalValue)}
    </>
  );
};
