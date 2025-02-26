'use client';
import { useTranslation } from 'react-i18next';

import { LeaderboardUserEntry } from '../Leaderboard/LeaderboardUserEntry';
import { Traits as TraitsComponent } from '../ProfilePage/Traits/Traits';
import { TraitsEntryStack } from '../ProfilePage/Traits/Traits.style';
import { PageContainer, SectionContainer, SectionTitle } from '../styles';
import { TraitsTitleBox } from './Traits.style';

export const Traits = () => {
  const { t } = useTranslation();

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
          <TraitsComponent hideTooltip={true} />
        </TraitsEntryStack>
      </SectionContainer>
    </PageContainer>
  );
};
