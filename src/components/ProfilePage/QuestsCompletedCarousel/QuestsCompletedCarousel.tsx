import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import { capitalizeString } from 'src/utils/capitalizeString';
import { QuestCard } from '../QuestCard/QuestCard';
import { VoidQuestCard } from '../QuestCard/VoidQuestCard';
import { QuestsOverviewContainer } from '../QuestsOverview/QuestsOverview.style';

interface QuestCompletedListProps {
  pdas?: PDA[];
  loading: boolean;
}

export const QuestsCompletedCarousel = ({
  pdas,
  loading,
}: QuestCompletedListProps) => {
  const { account } = useAccount();
  const { t } = useTranslation();

  const showVoidCardsAsFewPdas =
    (!loading && pdas && pdas?.length < 6 && account?.address) ||
    !account?.address;

  const today = new Date();
  const secondDay = new Date(today.getFullYear(), today.getMonth(), 2);
  const date = secondDay.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <QuestsOverviewContainer>
      <CarouselContainer
        title={t('missions.completed')}
        updateTitle={`Updated: ${date}`}
        updateTooltip={`As Jumper organize ad-hoc campaigns, the missions are updated on a monthly basis to create the associated graphics.
           Keep in mind: XP coming from specific campaigns will be updated on a monthly basis as well.`}
      >
        {/** render quests */}
        {!loading && pdas
          ? pdas?.map((pda: PDA, index: number) => {
              if (!pda?.reward) {
                return null;
              }
              const title = `${capitalizeString(pda.reward?.type)} (${capitalizeString(pda?.reward?.name)})`;
              return (
                <QuestCard
                  key={`completed-mission-${index}`}
                  id={pda?.id}
                  completed={true}
                  active={false}
                  title={title}
                  image={pda?.reward?.image}
                  points={pda?.points}
                />
              );
            })
          : null}
        {showVoidCardsAsFewPdas
          ? Array.from(
              { length: pdas && pdas?.length > 0 ? 4 - pdas.length : 2 },
              () => 42,
            ).map((_, idx) => (
              <VoidQuestCard
                key={'void-' + idx}
                // connected={!!account?.address && account?.chainType === 'EVM'}
              />
            ))
          : null}
        {loading
          ? Array.from({ length: 2 }, () => 42).map((_, idx) => (
              <QuestCard key={'skeleton-' + idx} />
            ))
          : null}
      </CarouselContainer>
    </QuestsOverviewContainer>
  );
};
