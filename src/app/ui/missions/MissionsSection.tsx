'use client';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  MissionSectionContainer,
  MissionSectionHeaderContainer,
  MissionSectionHeaderInfo,
} from './MissionsSection.style';
import { FC, PropsWithChildren } from 'react';

interface MissionsSectionProps extends PropsWithChildren {
  count: number;
}

export const MissionsSection: FC<MissionsSectionProps> = ({
  count = 0,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <SectionCard>
      <MissionSectionContainer>
        <MissionSectionHeaderContainer>
          <Typography variant="titleSmall">
            {t('missions.wrapperCard.title')}
          </Typography>
          <MissionSectionHeaderInfo variant="title2XSmall">
            {t('missions.wrapperCard.explore', { count })}
          </MissionSectionHeaderInfo>
        </MissionSectionHeaderContainer>
        {children}
      </MissionSectionContainer>
    </SectionCard>
  );
};
