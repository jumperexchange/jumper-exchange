import type { FC, ReactNode } from 'react';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import {
  overviewContentSx,
  StyledOverviewContainer,
} from './PositionOverview.styles';

interface PositionOverviewProps {
  icon: ReactNode;
  header: string;
  description: string;
}

export const PositionOverview: FC<PositionOverviewProps> = ({
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
