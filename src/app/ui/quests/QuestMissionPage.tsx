'use client';
import { QuestsMissionPage } from 'src/components/Quests/QuestsMisisonPage';

const QuestPage = ({ quest, url }: any) => {
  return <QuestsMissionPage quest={quest} baseUrl={url} />;
};

export default QuestPage;
