import { Tab, TabsContainer } from './Tabs.style';

interface TabProps {
  label: string;
  value: number;
  icon: JSX.Element;
  onClick: any;
  disabled?: boolean;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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
    <TabsContainer
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      // indicatorColor={indicatorColor}
    >
      {data.map(
        (el, index) =>
          !el.disabled && (
            <Tab
              key={`${el.label}-${index}`}
              onClick={(event) => {
                el.onClick(event, el.value);
              }}
              icon={el.icon}
              label={el.label}
              {...a11yProps(el.value)}
            />
          ),
      )}
    </TabsContainer>
  );
};
