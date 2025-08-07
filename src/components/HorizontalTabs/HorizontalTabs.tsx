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
  id?: string;
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
  id,
}: HorizontalTabsProps) => {
  const initialValue = value ? value : autoSelectFirst ? tabs[0]?.value : false;
  const [internalValue, setInternalValue] = useState<string | false>(
    initialValue,
  );

  useEffect(() => {
    if (value || syncWithValue) {
      setInternalValue(value ?? false);
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
              id={`${id}-${tab.value}`}
            />
          ))}
      </HorizontalTabsContainer>
      {!!renderContent && renderContent(internalValue ? internalValue : '')}
    </>
  );
};
