import { Tooltip } from '@mui/material';
import { Tab, TabsContainer } from './Tabs.style';

interface TabProps {
  label?: string;
  tooltip?: string;
  value: number;
  icon: JSX.Element;
  onClick: any;
  disabled?: boolean;
}

interface TabsProps {
  data: TabProps[];
  value: number | boolean;
  onChange: any;
  ariaLabel: string;
  indicatorColor: string;
}

export const Tabs = ({
  data,
  value,
  onChange,
  ariaLabel,
  indicatorColor,
}: TabsProps) => {
  return (
    <TabsContainer value={value} onChange={onChange} aria-label={ariaLabel}>
      {data.map((el, index) => {
        const tab = (
          <Tab
            key={`${el.label ?? 'tab-key'}-${index}`}
            onClick={(event) => {
              el.onClick(event, el.value);
            }}
            icon={el.icon}
            label={el.label}
            id={`tab-${el.label ?? 'key'}-${el.value}`}
            aria-controls={`simple-tabpanel-${index}`}
          />
        );
        return !!el.tooltip ? (
          <Tooltip
            title={el.tooltip ?? null}
            key={`tooltip-${el.label}-${index}`}
            enterTouchDelay={0}
            disableHoverListener={el.disabled}
            arrow
          >
            {tab}
          </Tooltip>
        ) : (
          tab
        );
      })}
    </TabsContainer>
  );
};
