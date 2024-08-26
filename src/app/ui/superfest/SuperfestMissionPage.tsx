'use client';
import { SuperfestMissionPage } from 'src/components/Superfest/SuperfestPage/SuperfestMisisonPage';
import { JUMPER_FEST_PATH } from 'src/const/urls';

const SuperfestPage = ({ quest, url }: any) => {
  return (
    <SuperfestMissionPage
      quest={quest}
      baseUrl={url}
      activeCampaign="superfest"
      path={JUMPER_FEST_PATH}
    />
  );
};

export default SuperfestPage;
