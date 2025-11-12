import { FC } from 'react';
import { TitleWithHint } from '../../TitleWithHint/TitleWithHint';
import {
  overviewContentSx,
  StyledOverviewContainer,
} from './DeFiPositionOverview.styles';

interface DeFiPositionOverviewProps {
  icon: React.ReactNode;
  header: string;
  description: string;
}

export const DeFiPositionOverview: FC<DeFiPositionOverviewProps> = ({
  icon,
  header,
  description,
}) => {
  return (
    <StyledOverviewContainer>
      {icon}
      <TitleWithHint
        title={description}
        titleVariant="bodyXSmallStrong"
        hint={header}
        hintVariant="bodyXXSmall"
        sx={overviewContentSx}
      />
    </StyledOverviewContainer>
  );
};
