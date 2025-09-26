import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { EarnFilterBarContainer } from './EarnFilterBar.styles';
import {
  HorizontalTabItem,
  HorizontalTabs,
} from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import { EarnFilterBarContentForYou } from './components/EarnFilterBarContentForYou';
import { EarnFilterBarContentAll } from './components/EarnFilterBarContentAll';
import Stack from '@mui/material/Stack';
import { EarnListMode } from './components/EarnListMode';
import { EarnFilterSort } from './components/EarnFilterSort';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';

export interface EarnFilterBarProps {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
}

export const EarnFilterBar: React.FC<EarnFilterBarProps> = ({
  variant,
  setVariant,
}) => {
  const { showForYou, toggleForYou } = useEarnFiltering();

  const tabOptions: HorizontalTabItem[] = [
    { value: 'foryou', label: 'For You' },
    { value: 'all', label: 'All Markets' },
  ];

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    toggleForYou();
  };

  const EarnFilterBarContent = showForYou
    ? EarnFilterBarContentForYou
    : EarnFilterBarContentAll;

  return (
    <EarnFilterBarContainer>
      <HorizontalTabs
        tabs={tabOptions}
        value={showForYou ? 'foryou' : 'all'}
        size={HorizontalTabSize.MD}
        onChange={handleTabChange}
        sx={(theme) => ({
          width: 'fit-content',
          backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
        })}
      />
      <EarnFilterBarContent>
        <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
          <EarnListMode variant={variant} setVariant={setVariant} />
          {!showForYou && <EarnFilterSort />}
        </Stack>
      </EarnFilterBarContent>
    </EarnFilterBarContainer>
  );
};
