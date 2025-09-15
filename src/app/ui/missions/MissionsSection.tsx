'use client';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  MissionSectionContainer,
  MissionSectionHeaderContainer,
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
          <Typography
            variant="title2XSmall"
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                fontWeight: 500,
              },
            })}
            color="textSecondary"
          >
            {t('missions.wrapperCard.explore', { count })}
          </Typography>
        </MissionSectionHeaderContainer>
        {children}
      </MissionSectionContainer>
    </SectionCard>
  );
};
