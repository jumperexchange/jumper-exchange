'use client';

import { FC } from 'react';
import { StrapiResponseData, QuestData } from 'src/types/strapi';
import { MissionCard } from './MissionCard';

interface MissionsListProps {
  missions: StrapiResponseData<QuestData>;
}

export const MissionsList: FC<MissionsListProps> = ({ missions }) => {
  return (
    <>
      {missions.map((mission: any) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </>
  );
};
