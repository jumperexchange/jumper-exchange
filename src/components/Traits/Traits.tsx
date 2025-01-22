'use client';
import { useTranslation } from 'react-i18next';

import useClient from 'src/hooks/useClient';
import { LeaderboardUserEntry } from '../Leaderboard/LeaderboardUserEntry';
import IconHeader from '../ProfilePage/Common/IconHeader';
import { Traits as TraitsComponent } from '../ProfilePage/Traits/Traits';
import { TraitsEntryStack } from '../ProfilePage/Traits/Traits.style';
import { PageContainer, SectionContainer, SectionTitle } from '../styles';
import { TraitsTitleBox, TraitsUpdateDateBox } from './Traits.style';

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
          <TraitsUpdateDateBox>
            {isClient && (
              <IconHeader
                tooltipKey={t('traits.description')}
                title={`Updated: ${t('format.date', { value: new Date() })}`}
              />
            )}
          </TraitsUpdateDateBox>
        </TraitsTitleBox>
        <LeaderboardUserEntry />
        <TraitsEntryStack>
          <TraitsComponent hideMoreButton={true} />
        </TraitsEntryStack>
      </SectionContainer>
    </PageContainer>
  );
};
