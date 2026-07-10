import type { FC, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  SectionCard,
  type SectionCardProp,
} from '@/components/Cards/SectionCard/SectionCard';

interface ActionableSectionProps extends SectionCardProp {
  title: string;
  action?: ReactNode;
}

export const ActionableSection: FC<ActionableSectionProps> = ({
  title,
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
        <Typography variant="titleSmall">{title}</Typography>
        {action}
      </Stack>
      {children}
    </SectionCard>
  );
};
