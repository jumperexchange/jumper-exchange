import { QuestCard } from '../QuestCard/QuestCard';
import {
  CompletedQuestContainer,
  CompletedQuestHeader,
  CompletedQuestStack,
  CompletedQuestTitle,
} from './QuestsCompletedList.style';
import { VoidQuestCard } from '../QuestCard/VoidQuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { useAccounts } from 'src/hooks/useAccounts';
import { useTranslation } from 'react-i18next';
import type { PDA } from 'src/types';

interface QuestCompletedList {
  pdas?: PDA[];
  // dataIsFetched: boolean;
  loading: boolean;
}

export const QuestCompletedList = ({ pdas, loading }: QuestCompletedList) => {
  const { account } = useAccounts();
  const { t } = useTranslation();

  const showVoidCardsAsFewPdas =
    (!loading && pdas && pdas?.length < 6 && account?.address) ||
    !account?.address;

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
        {!loading && pdas
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
                connected={!!account?.address && account?.chainType === 'EVM'}
              />
            ))
          : null}
        {loading
          ? Array.from({ length: 3 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
