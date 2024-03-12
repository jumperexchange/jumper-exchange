import { QuestCard } from './QuestCard';
import {
  CompletedQuestContainer,
  CompletedQuestHeader,
  CompletedQuestStack,
  CompletedQuestTitle,
} from './QuestsCompletedList.style';
import { VoidQuestCard } from './VoidQuestCard';
import { QuestCardSkeleton } from './QuestCardSkeleton';
import { useAccounts } from 'src/hooks/useAccounts';

export const QuestCompletedList = ({ pdas, dataIsFetched }: any) => {
  const { account } = useAccounts();

  return (
    <CompletedQuestContainer>
      <CompletedQuestHeader>
        <CompletedQuestTitle>Completed Missions</CompletedQuestTitle>
      </CompletedQuestHeader>
      <CompletedQuestStack
        direction={'row'}
        spacing={4}
        useFlexGap
        flexWrap="wrap"
      >
        {dataIsFetched && pdas
          ? pdas?.map((pda: any, index: number) => {
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
        {(dataIsFetched && pdas.length < 6 && account?.address) ||
        !account?.address
          ? Array.from(
              { length: pdas.length > 0 ? 6 - pdas.length : 3 },
              () => 42,
            ).map(() => <VoidQuestCard />)
          : null}
        {account?.address && !dataIsFetched
          ? Array.from({ length: 6 }, () => 42).map(() => <QuestCardSkeleton />)
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
