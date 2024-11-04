'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import type { RefObject } from 'react';
import { type ReactElement, useCallback, useMemo, useRef } from 'react';
import { QUESTS, TOOLTIP_MESSAGES } from '../utils/constants';
import { colors, Flex, mq, WashH1 } from '../utils/theme';

import { CollectButton } from './CollectButton';
import { InfoTooltip } from './InfoTooltip';
import { IconDone } from './icons/IconDone';

import { useWashTrading } from '../contexts/useWashTrading';
import type { TQuest } from '../types/wash';
import { Button } from './Button';
import { IconArrowLeft } from './icons/IconArrowLeft';
import type { FormState } from '@lifi/widget';

/**************************************************************************************************
 * Defining the styled components style for the QuestItem component
 *************************************************************************************************/
const QuestItemWrapper = styled.div`
  display: flex;
  max-width: 722px;
  gap: 0.5rem;
  border-radius: 1rem;
  background-color: ${colors.violet[200]};
  padding: 0.5rem;
  box-shadow: 4px 4px 0px ${colors.violet[800]};
  transform: skew(-6deg);
  ${mq[0]} {
    display: none;
  }
`;

const BoosterWrapper = styled.div<{ isCompleted: boolean; isCommon: boolean }>`
  height: min-content;
  border-radius: 1rem;
  border: 2px solid #4c1d95;
  background-color: #6d28d9;
  min-height: 88px;
  min-width: 88px;
  position: relative;
  box-shadow:
    4px 4px 0px 0px ${colors.violet[300]},
    0px 0px 0px 0px ${colors.cyan[800]},
    0px 0px 0px 0px ${colors.pink[800]};
  transition: all;
  transition-duration: 600ms;
  &:hover {
    box-shadow: ${(props) =>
      props.isCompleted && props.isCommon
        ? `4px 4px 0px 0px ${colors.pink[800]}`
        : props.isCompleted
          ? `4px 4px 0px 0px ${colors.cyan[800]}`
          : `4px 4px 0px 0px ${colors.violet[300]}, 0px 0px 0px 0px ${colors.cyan[800]}, 0px 0px 0px 0px ${colors.pink[800]};`};
    transition: ${(props) =>
      props.isCompleted && props.isCommon ? 'all ease-in' : 'all'};
  }
  ${mq[0]} {
    min-height: 48px;
    min-width: 48px;
    box-shadow:
      2px 2px 0px 0px #390083,
      0px 0px 0px 0px #00b6bf,
      0px 0px 0px 0px #ff009d;
    border-radius: 0.5rem;
  }
`;

const BoosterImage = styled(Image)<{ isComplete: boolean }>`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	transition-duration: 300ms;
  height: auto;
	&:hover {
		width: ${(props) => (props.isComplete ? '80px' : '72px')};
    height: ${(props) => (props.isComplete ? '80px' : '72px')};
		transition: ${(props) => (props.isComplete ? 'all ease-out' : 'all ease-in')};
	}
	&:not(:hover) {
		width: 72px
		transition: all ease-in;
	}
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const QuestInfoWrapper = styled.div<{ questBackground: string }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0.25rem;
  align-items: center;
  border-radius: 0.75rem;
  background: ${(props) => props.questBackground};
`;

const QuestInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
`;

const QuestDescription = styled.p`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  padding-left: 1rem;

  ${mq[0]} {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    padding-left: 0.5rem;
  }
`;

const QuestHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const QuestHeading = styled.span<{ questType: 'common' | 'rare' | 'done' }>`
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  color: ${(props) =>
    props.questType === 'common'
      ? colors.pink[800]
      : props.questType === 'rare'
        ? colors.cyan[800]
        : 'white'};
`;

const QuestTitle = styled.p`
  font-weight: 900;
  color: white;
  margin: 0;
`;

const QuestItemMobileWrapper = styled.div`
  background-color: ${colors.violet[200]};
  display: none;
  gap: 0.25rem;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 4px 4px 0px #8000ff;
  transform: skew(-3deg);
  flex-direction: column;
  justify-content: space-between;
  ${mq[0]} {
    display: flex;
  }
`;

const QuestItemInnerBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VolumeWarning = styled.span<{ questType: 'common' | 'rare' }>`
  color: ${({ questType }) =>
    questType === 'common' ? colors.pink[800] : colors.cyan[800]};
`;

const GoToSwapButton = styled(Button)<{
  width?: string;
  questType: 'common' | 'rare';
}>`
  background-color: ${(props) =>
    props.questType === 'common' ? colors.pink[800] : colors.cyan[800]};
  transform: skewX(-1deg);
  width: ${(props) => props.width || '40px'};
  height: 48px;
  border-radius: 8px;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.questType === 'common' ? colors.pink[700] : colors.cyan[700]};
  }
`;

/**************************************************************************************************
 * QuestItem Component
 *
 * This component renders a single quest item with its details, progress, and claim button.
 * It uses styled components for consistent styling and handles different quest types and states.
 *
 * Props:
 * - TQuest: Contains all the quest details including progress, type, title, and description.
 *************************************************************************************************/
export function QuestItem(
  props: TQuest & { formRef?: RefObject<FormState> },
): ReactElement {
  const elementRef = useRef<HTMLButtonElement>(null);
  const isDone = props.progress === props.progressSteps;

  /**********************************************************************************************
   * Determines the background color or gradient for the quest item based on its progress and
   * type.
   * Returns:
   * - Violet background for incomplete quests
   * - Pink gradient for completed common quests
   * - Cyan gradient for completed rare quests
   *********************************************************************************************/
  const getQuestBg = (): string => {
    if (!props.progress || props.progress < props.progressSteps) {
      return colors.violet[100];
    }
    if (props.questType === 'common') {
      return `linear-gradient(to right, ${colors.pink[600]}, ${colors.pink[800]})`;
    }
    return `linear-gradient(to right, ${colors.cyan[600]}, ${colors.cyan[800]})`;
  };

  /**********************************************************************************************
   * Handles quest selection by updating form values and scrolling to top
   *
   * Updates form fields with:
   * - Solana chain ID for both from/to chains
   * - Selected sending token for fromToken
   * - Selected receiving token for toToken
   *
   * After setting form values, smoothly scrolls window to top
   *********************************************************************************************/
  const onSelectQuest = useCallback(() => {
    const queryArgs = { setUrlSearchParam: true };
    const ref = props.formRef?.current;
    const solID = 1151111081099710;
    const sendToken = props.sendingToken[0];
    const receiveToken = props.receivingToken[0];
    ref?.setFieldValue('fromChain', solID, queryArgs);
    ref?.setFieldValue('fromToken', sendToken, queryArgs);
    ref?.setFieldValue('toChain', solID, queryArgs);
    ref?.setFieldValue('toToken', receiveToken, queryArgs);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [props.formRef, props.sendingToken, props.receivingToken]);

  return (
    <>
      <QuestItemWrapper>
        <BoosterWrapper
          isCompleted={isDone}
          isCommon={props.questType === 'common'}
        >
          <BoosterImage
            src={props.powerUp.logo}
            alt={'power-up'}
            isComplete={!isDone}
            width={72}
            height={72}
          />
        </BoosterWrapper>
        <ContentWrapper>
          <QuestInfoWrapper questBackground={getQuestBg()}>
            <QuestInfo>
              <QuestHeadingWrapper>
                <QuestHeading questType={isDone ? 'done' : props.questType}>
                  {isDone
                    ? 'DONE'
                    : props.questType === 'common'
                      ? 'Common quest'
                      : 'Rare quest'}
                </QuestHeading>
                <IconDone style={{ opacity: isDone ? 1 : 0 }} />
              </QuestHeadingWrapper>
              <QuestTitle>{props.title}</QuestTitle>
            </QuestInfo>
            <Flex>
              <CollectButton
                ref={elementRef}
                style={{ transform: 'skewX(0deg)' }}
                size={'short'}
                theme={props.questType === 'common' ? 'pink' : 'cyan'}
                progress={props.progress}
                progressSteps={props.progressSteps}
              />
              <GoToSwapButton
                questType={props.questType}
                onClick={onSelectQuest}
              >
                <IconArrowLeft />
              </GoToSwapButton>
            </Flex>
          </QuestInfoWrapper>
          <QuestDescription>
            {props.description}&nbsp;
            <VolumeWarning questType={props.questType}>
              {'Swap at least $10 per trade for this quest.'}
            </VolumeWarning>
          </QuestDescription>
        </ContentWrapper>
      </QuestItemWrapper>

      <QuestItemMobileWrapper>
        <div>
          <QuestItemInnerBox>
            <QuestInfo>
              <QuestHeadingWrapper>
                <QuestHeading questType={isDone ? 'done' : props.questType}>
                  {isDone
                    ? 'DONE'
                    : props.questType === 'common'
                      ? 'Common quest'
                      : 'Rare quest'}
                </QuestHeading>
                <IconDone style={{ opacity: isDone ? 1 : 0 }} />
              </QuestHeadingWrapper>
              <QuestTitle>{props.title}</QuestTitle>
            </QuestInfo>
            <BoosterWrapper
              isCompleted={isDone}
              isCommon={props.questType === 'common'}
            >
              <BoosterImage
                src={props.powerUp.logo}
                alt={''}
                isComplete={!isDone}
                width={32}
                height={32}
              />
            </BoosterWrapper>
          </QuestItemInnerBox>
          <QuestDescription>
            {props.description}&nbsp;
            <VolumeWarning questType={props.questType}>
              {'Swap at least $10 per trade for this quest.'}
            </VolumeWarning>
          </QuestDescription>
        </div>

        <div style={{ display: 'flex' }}>
          <CollectButton
            ref={elementRef}
            style={{ transform: 'skewX(0deg)', width: '100%' }}
            theme={props.questType === 'common' ? 'pink' : 'cyan'}
            progress={props.progress}
            progressSteps={props.progressSteps}
          />
          <GoToSwapButton
            questType={props.questType}
            width={'60px'}
            onClick={onSelectQuest}
          >
            <IconArrowLeft />
          </GoToSwapButton>
        </div>
      </QuestItemMobileWrapper>
    </>
  );
}

/**************************************************************************************************
 * Defining the styled components style for the QuestsList component
 *************************************************************************************************/
const QuestsListWrapper = styled.div`
  max-width: 776px;
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
  background-color: ${colors.violet[500]};
  padding: 32px;
  box-shadow: 6px 6px 0px 0px ${colors.violet[800]};

  ${mq[0]} {
    max-width: 343px;
    padding: 24px;
  }
`;
const QuestsListHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;
const QuestList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  min-height: 40dvh;
`;

/**************************************************************************************************
 * QuestsList Component
 *
 * This component renders a list of quests or a skeleton placeholder.
 *
 * Props:
 * - isSkeleton: boolean (optional) - If true, renders a skeleton placeholder instead of quests
 *
 * The component displays a header with the title "Quests" and an info popup.
 * It then renders either a skeleton placeholder or a list of QuestItem components based on the
 * QUESTS constant.
 ************************************************************************************************/
export function QuestsList(props: {
  isSkeleton?: boolean;
  formRef?: RefObject<FormState>;
}): ReactElement {
  const { user } = useWashTrading();

  const questsForUser = useMemo(() => {
    const activeQuests = [];

    for (const quest of user?.quests || []) {
      const questData = QUESTS.find((q) => q.id === quest.questId);
      if (questData) {
        activeQuests.push({ ...questData, progress: quest.progress });
      }
    }
    return activeQuests.sort((a, b) => a.order - b.order);
  }, [user?.quests]);

  return (
    <QuestsListWrapper>
      <QuestsListHeader>
        <WashH1>{'Quests'}</WashH1>
        <InfoTooltip description={TOOLTIP_MESSAGES.quest} />
      </QuestsListHeader>

      <QuestList>
        {props.isSkeleton
          ? null
          : questsForUser.map((quest, i) => (
              <QuestItem
                key={`${quest.title}-${i}`}
                formRef={props.formRef}
                {...quest}
              />
            ))}
      </QuestList>
    </QuestsListWrapper>
  );
}
