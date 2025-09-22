import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { IconButton, IconButtonDynamic } from '../IconButton';

type Props = {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
};

export const EarnListMode: React.FC<Props> = ({ variant, setVariant }) => {
  return (
    <>
      <IconButtonDynamic
        onClick={() => setVariant('list-item')}
        variant={variant === 'list-item' ? 'primary' : undefined}
      >
        <ListIcon />
      </IconButtonDynamic>
      <IconButtonDynamic
        onClick={() => setVariant('compact')}
        variant={variant === 'compact' ? 'primary' : undefined}
      >
        <GridViewIcon />
      </IconButtonDynamic>
    </>
  );
};
