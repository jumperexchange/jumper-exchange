'use client';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useClient from 'src/hooks/useClient';
import { LeaderboardUserEntry } from '../Leaderboard/LeaderboardUserEntry';
import IconHeader from '../ProfilePage/Common/IconHeader';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { Traits as TraitsComponent } from '../ProfilePage/Traits/Traits';
import { TraitsEntryStack } from '../ProfilePage/Traits/Traits.style';
import {
  TraitsContainer,
  TraitsHeader,
  TraitsTitleBox,
  TraitsUpdateDateBox,
} from './Traits.style';

export const Traits = () => {
  const { t } = useTranslation();
  const isClient = useClient();

  return (
    <PageContainer>
      <TraitsContainer>
        <TraitsHeader>
          <TraitsTitleBox>
            <Typography variant="headerMedium">{t('traits.title')}</Typography>
            <TraitsUpdateDateBox>
              {isClient && (
                <IconHeader
                  tooltipKey={t('traits.description')}
                  title={`Updated: ${t('format.date', { value: new Date() })}`}
                />
              )}
            </TraitsUpdateDateBox>
          </TraitsTitleBox>
        </TraitsHeader>
        <LeaderboardUserEntry />
        <TraitsEntryStack>
          <TraitsComponent hideMoreButton={true} />
        </TraitsEntryStack>
      </TraitsContainer>
    </PageContainer>
  );
};
