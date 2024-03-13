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
import { PDA } from 'src/types';

interface QuestCompletedList {
  pdas?: PDA[];
  dataIsFetched: boolean;
}

export const QuestCompletedList = ({
  pdas,
  dataIsFetched,
}: QuestCompletedList) => {
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
            ).map((_, idx) => <VoidQuestCard key={'void-' + idx} />)
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
