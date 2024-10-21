'use client';

import { type ReactElement, useRef } from 'react';
import Image from 'next/image';
import { colors, WashH1 } from '../utils/theme';
import { QUESTS, TOOLTIP_MESSAGES } from '../utils/constants';
import { cl } from '../utils/utils';
import styled from '@emotion/styled';

import { CollectButton } from './CollectButton';
import { InfoPopup } from './InfoPopup';
import { IconDone } from './icons/IconDone';

import type { TQuest } from '../types/wash';

/************************************************************************************************
 * Defining the styled components style for the QuestItem component
 *************************************************************************************************/
const QuestItemWrapper = styled.div`
  display: flex;
  max-width: 722px;
  gap: 1rem;
  border-radius: 1rem;
  background-color: ${colors.violet[200]};
  padding: 0.5rem;
  box-shadow: 4px 4px 0px #8000ff;
  transform: skew(-6deg);
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
    4px 4px 0px 0px #390083,
    0px 0px 0px 0px #00b6bf,
    0px 0px 0px 0px #ff009d;
  transition: all;
  transition-duration: 600ms;
  &:hover {
    box-shadow: ${(props) =>
      props.isCompleted && props.isCommon
        ? '4px 4px 0px 0px #FF009D'
        : props.isCompleted
          ? '4px 4px 0px 0px #00B6BF'
          : '4px 4px 0px 0px #390083, 0px 0px 0px 0px #00b6bf, 0px 0px 0px 0px #ff009d;'};
    transition: ${(props) =>
      props.isCompleted && props.isCommon ? 'all ease-in' : 'all'};
  }
`;

const BoosterImage = styled(Image)<{ isComplete: boolean }>`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	transition-duration: 300ms;
	&:hover {
		width: ${(props) => (props.isComplete ? '80px' : '72px')};
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
export function QuestItem(props: TQuest): ReactElement {
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

  return (
    <QuestItemWrapper>
      <BoosterWrapper
        isCompleted={isDone}
        isCommon={props.questType === 'common'}
      >
        <BoosterImage
          src={props.powerUp.logo}
          alt={''}
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
                {isDone ? 'DONE' : props.heading}
              </QuestHeading>
              <IconDone style={{ opacity: isDone ? 1 : 0 }} />
            </QuestHeadingWrapper>
            <QuestTitle>{props.title}</QuestTitle>
          </QuestInfo>
          <CollectButton
            ref={elementRef}
            className={'skew-x-0'}
            onClick={() => {}}
            theme={props.questType === 'common' ? 'pink' : 'cyan'}
            progress={props.progress}
            progressSteps={props.progressSteps}
          />
        </QuestInfoWrapper>
        <QuestDescription>{props.description}</QuestDescription>
      </ContentWrapper>
    </QuestItemWrapper>
  );
}

/************************************************************************************************
 * Defining the styled components style for the QuestsList component
 *************************************************************************************************/
const QuestsListWrapper = styled.div`
  max-width: 776px;
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
  background-color: ${colors.violet[500]};
  padding: 32px;
  box-shadow: 6px 6px 0px 0px #8000ff;
`;

/************************************************************************************************
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
export function QuestsList(props: { isSkeleton?: boolean }): ReactElement {
  return (
    <QuestsListWrapper>
      <div className={'mb-4 flex items-center gap-2'}>
        <WashH1>{'Quests'}</WashH1>
        <InfoPopup description={TOOLTIP_MESSAGES.quest} />
      </div>

      <div className={'flex-gap flex flex-col gap-y-4'}>
        {props.isSkeleton ? (
          <div className={'min-h-[40dvh]'} />
        ) : (
          QUESTS.map((quest, index) => (
            <QuestItem key={`${quest.title}-${index}`} {...quest} />
          ))
        )}
      </div>
    </QuestsListWrapper>
  );
}
