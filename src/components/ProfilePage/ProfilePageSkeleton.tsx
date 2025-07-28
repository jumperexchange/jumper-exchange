'use client';

import { GridContainer } from '../Containers/GridContainer';
import { PageContainer } from '../Containers/PageContainer';
import { PerksListSkeleton } from './components/PerksList/PerksListSkeleton';
import { IntroSectionSkeleton } from './sections/IntroSectionSkeleton';
import { AvailableTabs } from './TabsSection/constants';
import { TabsSection } from './TabsSection/TabsSection';

export const ProfilePageSkeleton = () => {
  return (
    <PageContainer>
      <IntroSectionSkeleton />
      <TabsSection>
        {(activeTab: string) => {
          if (activeTab === AvailableTabs.Achievements) {
            return <p>Achievements Skeleton</p>;
          } else if (activeTab === AvailableTabs.Perks) {
            return (
              <GridContainer>
                <PerksListSkeleton />
              </GridContainer>
            );
          }
        }}
      </TabsSection>
    </PageContainer>
  );
};
