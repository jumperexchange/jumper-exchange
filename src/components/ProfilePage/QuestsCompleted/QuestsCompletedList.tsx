import { useAccounts } from '@/hooks/useAccounts';
import type { PDA } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { QuestCardCompleted } from '../QuestCardCompleted/QuestCardCompleted';
import { QuestCardCompletedSkeleton } from '../QuestCardCompleted/QuestCardCompletedSkeleton';
import { VoidQuestCardCompleted } from '../QuestCardCompleted/VoidQuestCardCompleted';
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
              if (!pda?.reward) {
                return null;
              }
              return (
                <QuestCardCompleted
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
              <VoidQuestCardCompleted
                key={'void-' + idx}
                connected={!!account?.address && account?.chainType === 'EVM'}
              />
            ))
          : null}
        {loading
          ? Array.from({ length: 2 }, () => 42).map((_, idx) => (
              <QuestCardCompletedSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
