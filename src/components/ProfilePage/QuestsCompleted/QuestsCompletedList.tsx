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
  loading: boolean;
}

export const QuestCompletedList = ({
  pdas,
  loading,
}: QuestCompletedListProps) => {
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
        spacing={{ xs: 2, sm: 4 }}
        useFlexGap
        flexWrap="wrap"
      >
        {!loading && pdas
          ? pdas?.map((pda: PDA, index: number) => {
              return (
                <QuestCard
                  key={`completed-mission-${index}`}
                  id={pda?.id}
                  active={false}
                  title={pda?.reward?.name}
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
                connected={!!account?.address && account?.chainType === 'EVM'}
              />
            ))
          : null}
        {loading
          ? Array.from({ length: 2 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
