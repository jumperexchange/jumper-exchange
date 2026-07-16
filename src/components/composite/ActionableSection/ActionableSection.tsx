import type { FC, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  SectionCard,
  type SectionCardProp,
} from '@/components/Cards/SectionCard/SectionCard';

interface ActionableSectionProps extends SectionCardProp {
  title: string;
  filters?: ReactNode;
  action?: ReactNode;
}

export const ActionableSection: FC<ActionableSectionProps> = ({
  title,
  filters,
  action,
  children,
  sx,
  id,
}) => {
  return (
    <SectionCard id={id} sx={sx}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" sx={{ gap: 3, alignItems: 'center' }}>
          <Typography variant="titleSmall">{title}</Typography>
          {filters}
        </Stack>
        {action}
      </Stack>
      {children}
    </SectionCard>
  );
};
