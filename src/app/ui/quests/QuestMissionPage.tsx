'use client';

import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_LOYALTY_PATH } from 'src/const/urls';

const QuestPage = ({ quest, url }: any) => {
  return (
    <QuestsMissionPage quest={quest} baseUrl={url} path={JUMPER_LOYALTY_PATH} />
  );
};

export default QuestPage;
