'use client';

import { QuestsMissionPage } from 'src/components/Quests/QuestsMissionPage';
import type { Quest } from 'src/types/loyaltyPass';

interface QuestPageProps {
  quest: Quest;
  url: string;
  path: string;
  platform: string;
}

const QuestMissionPage = ({ quest, url, path, platform }: QuestPageProps) => {
  return (
    <QuestsMissionPage
      quest={quest}
      baseUrl={url}
      path={path}
      platform={platform}
    />
  );
};

export default QuestMissionPage;
