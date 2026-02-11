import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant } from '@/components/core/buttons/types';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';

export const commonArgs = {
  tabs: [
    { label: 'Your positions', value: 'positions' },
    { label: 'Your yield', value: 'yield' },
  ],
  size: HorizontalTabSize.SM,
};

const renderContent = (view: string) => {
  if (view === 'yield') {
    return <Typography>This is the yield view</Typography>;
  }

  return <Typography>This is the positions view</Typography>;
};

const renderHeader = () => {
  return (
    <IconButton variant={Variant.Success}>
      <CheckIcon />
    </IconButton>
  );
};

export const withContentArgs = {
  ...commonArgs,
  renderContent,
};

export const withHeaderArgs = {
  ...commonArgs,
  renderHeader,
};

export const withHeaderContentArgs = {
  ...commonArgs,
  renderContent,
  renderHeader,
};
