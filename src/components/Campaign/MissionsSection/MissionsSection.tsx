'use client';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { MissionSectionContainer } from './MissionsSection.style';
import { FC, PropsWithChildren } from 'react';

interface MissionsSectionProps extends PropsWithChildren {}

export const MissionsSection: FC<MissionsSectionProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <SectionCard>
      <MissionSectionContainer>
        <Typography variant="titleSmall">
          {t('campaign.missions.title')}
        </Typography>
        {children}
      </MissionSectionContainer>
    </SectionCard>
  );
};
