import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useChains } from '@/hooks/useChains';
import { useDexsAndBridges } from '@/hooks/useDexsAndBridges';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { DataItem } from '@/types/internal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolCardsContainer as Container } from './ToolCards.style';
import { ToolCard } from './ToolCard';

import dynamic from 'next/dynamic';

const ToolModal = dynamic(
  () => import('../ToolModal/ToolModal').then((m) => m.ToolModal),
  { loading: () => null },
);

interface ToolConfig {
  id: string;
  title: string;
  trackingLabel: string;
  data: DataItem[];
}

export const ToolCards = () => {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const { exchanges, bridges } = useDexsAndBridges();
  const { chains } = useChains();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const tools: ToolConfig[] = [
    {
      id: 'chains',
      title: t('navbar.statsCards.chains'),
      trackingLabel: 'chains_stats',
      data: chains ?? [],
    },
    {
      id: 'bridges',
      title: t('navbar.statsCards.bridges'),
      trackingLabel: 'bridges_stats',
      data: bridges ?? [],
    },
    {
      id: 'dexs',
      title: t('navbar.statsCards.dexs'),
      trackingLabel: 'dexes_stats',
      data: exchanges ?? [],
    },
  ];

  const handleCardClick =
    (tool: ToolConfig) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.OpenToolModal,
        label: tool.trackingLabel,
        data: { [TrackingEventParameter.ToolModal]: tool.trackingLabel },
      });
      setOpenModalId((current) => (current === tool.id ? null : tool.id));
    };

  const activeTool = tools.find((tool) => tool.id === openModalId) ?? null;

  return (
    <Container>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          title={tool.title}
          number={tool.data.length.toString()}
          handleClick={handleCardClick(tool)}
        />
      ))}
      {activeTool && (
        <ToolModal
          title={activeTool.title}
          open={true}
          setOpen={(open) => setOpenModalId(open ? openModalId : null)}
          data={activeTool.data}
        />
      )}
    </Container>
  );
};
