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
  autoSelectFirst?: boolean;
  // This is used to sync the value with the parent component, even if the value is undefined
  syncWithValue?: boolean;
}

export const HorizontalTabs = ({
  tabs,
  onChange,
  value,
  size = HorizontalTabSize.LG,
  sx,
  renderContent,
  autoSelectFirst = true,
  syncWithValue = false,
}: HorizontalTabsProps) => {
  const initialValue = value
    ? value
    : autoSelectFirst
      ? tabs[0]?.value
      : undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    initialValue,
  );

  useEffect(() => {
    if (value || syncWithValue) {
      setInternalValue(value);
    }
  }, [value, syncWithValue]);

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
            />
          ))}
      </HorizontalTabsContainer>
      {!!renderContent && renderContent(internalValue ?? '')}
    </>
  );
};
