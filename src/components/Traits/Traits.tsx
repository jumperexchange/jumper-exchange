'use client';
import { useTranslation } from 'react-i18next';

import useClient from 'src/hooks/useClient';
import { LeaderboardUserEntry } from '../Leaderboard/LeaderboardUserEntry';
import { Traits as TraitsComponent } from '../ProfilePage/Traits/Traits';
import { TraitsEntryStack } from '../ProfilePage/Traits/Traits.style';
import { PageContainer, SectionContainer, SectionTitle } from '../styles';
import { TraitsTitleBox } from './Traits.style';

export const Traits = () => {
  const { t } = useTranslation();
  const isClient = useClient();

  return (
    <PageContainer>
      <SectionContainer>
        <TraitsTitleBox>
          <SectionTitle variant="headerMedium">
            {t('traits.title')}
          </SectionTitle>
        </TraitsTitleBox>
        <LeaderboardUserEntry
          hideRank={true}
          loadingLabel={`${t('traits.label')}`}
        />
        <TraitsEntryStack>
          <TraitsComponent
            hideTooltip={false}
            sx={{ flexDirection: 'column' }}
          />
        </TraitsEntryStack>
      </SectionContainer>
    </PageContainer>
  );
};
