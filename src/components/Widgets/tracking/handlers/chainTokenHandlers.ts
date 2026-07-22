import type { ChainTokenSelected } from '@jumperexchange/widget';
import { TrackingEventParameter } from '@/const/trackingKeys';
import type { WidgetEventsConfig } from '@/components/Widgets/WidgetEventsManager';
import { trackWidgetEvent } from '@/components/Widgets/tracking/trackWidgetEvent';
import type {
  HandlerContext,
  WidgetEventConfig,
} from '@/components/Widgets/tracking/types';

export const createSourceChainTokenHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  sourceChainTokenSelected: async (sourceToken: ChainTokenSelected) => {
    trackWidgetEvent(ctx.tracking, config, 'select_source_chain_and_token', {
      [TrackingEventParameter.SourceChainSelection]: sourceToken.chainId,
      [TrackingEventParameter.SourceTokenSelection]: sourceToken.tokenAddress,
    });
    ctx.session.onSourceTokenSelected(sourceToken);
  },
});

export const createDestinationChainTokenHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  destinationChainTokenSelected: async (toChainData: ChainTokenSelected) => {
    trackWidgetEvent(
      ctx.tracking,
      config,
      'select_destination_chain_and_token',
      {
        [TrackingEventParameter.DestinationChainSelection]: toChainData.chainId,
        [TrackingEventParameter.DestinationTokenSelection]:
          toChainData.tokenAddress,
      },
    );
    ctx.session.onDestinationTokenSelected(toChainData);
  },
});
