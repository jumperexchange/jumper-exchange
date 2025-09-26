import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { IconSelect } from '../core/IconSelect/IconSelect';
import { IconOption } from '../core/IconSelect/IconSelect.types';

type Props = {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
};

export const EarnListMode: React.FC<Props> = ({ variant, setVariant }) => {
  const viewOptions: IconOption[] = [
    {
      value: 'list-item',
      icon: <ListIcon />,
      tooltip: 'List View',
    },
    {
      value: 'compact',
      icon: <GridViewIcon />,
      tooltip: 'Grid View',
    },
  ];

  const handleChange = (value: string | string[]) => {
    setVariant(value as EarnCardVariant);
  };

  return (
    <IconSelect
      options={viewOptions}
      value={variant}
      onChange={handleChange}
      selectionMode="radio"
      variant="text"
      size="medium"
      showTooltip={true}
      color="primary"
      data-testid="earn-filter-list-mode-select"
    />
  );
};
