import { useAccounts } from '@/hooks/useAccounts';
import type { PDA } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { VoidQuestCard } from '../QuestCard/VoidQuestCard';
import {
  CompletedQuestContainer,
  CompletedQuestHeader,
  CompletedQuestStack,
  CompletedQuestTitle,
} from './QuestsCompletedList.style';

interface QuestCompletedListProps {
  pdas?: PDA[];
  dataIsFetched: boolean;
}

export const QuestCompletedList = ({
  pdas,
  dataIsFetched,
}: QuestCompletedListProps) => {
  const { account } = useAccounts();
  const { t } = useTranslation();

  const showVoidCardsAsFewPdas =
    (dataIsFetched && pdas && pdas?.length < 6 && account?.address) ||
    !account?.address;
  const loadingPdas = account?.address && !dataIsFetched;

  return (
    <CompletedQuestContainer>
      <CompletedQuestHeader>
        <CompletedQuestTitle>{t('missions.completed')}</CompletedQuestTitle>
      </CompletedQuestHeader>
      <CompletedQuestStack
        direction={'row'}
        spacing={4}
        useFlexGap
        flexWrap="wrap"
      >
        {dataIsFetched && pdas
          ? pdas?.map((pda: PDA, index: number) => {
              return (
                <QuestCard
                  key={`completed-mission-${index}`}
                  active={false}
                  title={pda?.dataAsset.title}
                  image={pda?.dataAsset.image}
                  points={pda?.dataAsset.claim.points}
                />
              );
            })
          : null}
        {showVoidCardsAsFewPdas
          ? Array.from(
              { length: pdas && pdas?.length > 0 ? 6 - pdas.length : 3 },
              () => 42,
            ).map((_, idx) => (
              <VoidQuestCard
                key={'void-' + idx}
                connected={!!account?.address}
              />
            ))
          : null}
        {loadingPdas
          ? Array.from({ length: 6 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
