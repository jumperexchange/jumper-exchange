import { useTranslation } from 'react-i18next';
import { IconSelect } from '../../core/IconSelect/IconSelect';

export const ApyWindowOptions = {
  SEVEN_DAY: '7d',
  THIRTY_DAY: '30d',
} as const;

export type ApyWindow = '7d' | '30d';

type Props = {
  value: ApyWindow;
  onChange: (value: ApyWindow) => void;
  disabled?: boolean;
};

export const EarnApyWindowToggle: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <IconSelect
      options={[
        {
          value: ApyWindowOptions.SEVEN_DAY,
          icon: null,
          label: t('earn.apyWindow.label7d'),
          tooltip: t('earn.apyWindow.tooltip7d'),
        },
        {
          value: ApyWindowOptions.THIRTY_DAY,
          icon: null,
          label: t('earn.apyWindow.label30d'),
          tooltip: t('earn.apyWindow.tooltip30d'),
        },
      ]}
      value={value}
      onChange={(v) => onChange(v as ApyWindow)}
      selectionMode="radio"
      variant="text"
      size="small"
      showLabel
      showTooltip
      color="primary"
      disabled={disabled}
      data-testid="earn-filter-apy-window-select"
    />
  );
};
