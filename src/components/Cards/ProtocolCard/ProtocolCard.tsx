import type { FC } from 'react';
import { useState } from 'react';
import {
  ProtocolCardContainer,
  ProtocolCardContentContainer,
  ProtocolCardContentHeaderContainer,
  ProtocolCardDescriptionContainer,
  ProtocolCardHeaderBadgeContainer,
  ProtocolCardHeaderContainer,
  ProtocolCardHeaderContentContainer,
  ProtocolCardProtocolAvatar,
  ProtocolCardProtocolTitle,
  ProtocolCardTagsContainer,
  ProtocolCardTitleContainer,
} from './ProtocolCard.styles';
import { PROTOCOL_CARD_SIZES } from './constants';
import Typography from '@mui/material/Typography';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'src/utils/capitalizeString';
import { ProtocolCardSkeleton } from './ProtocolCardSkeleton';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { useGetContrastTextColor } from 'src/hooks/images/useGetContrastTextColor';
import { ProtocolCardDescription } from './components/ProtocolCardDescription';
import { ProtocolCardDescriptionModal } from './components/ProtocolCardDescriptionModal';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';

interface CommonCardProps {
  fullWidth?: boolean;
  headerBadge?: React.ReactNode;
}

export interface ProtocolCardNotEmptyProps extends CommonCardProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading?: boolean;
}

export interface ProtocolCardEmptyAndLoadingProps extends CommonCardProps {
  data: null;
  isLoading: true;
}

export type ProtocolCardProps =
  | ProtocolCardNotEmptyProps
  | ProtocolCardEmptyAndLoadingProps;

export const ProtocolCard: FC<ProtocolCardProps> = ({
  data,
  isLoading,
  fullWidth,
  headerBadge,
}) => {
  const [protocolAvatarLoaded, setProtocolAvatarLoaded] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const { protocol, tags, description, url, name, lpToken } = data ?? {};
  const title = name || protocol?.product || protocol?.name;
  const { t } = useTranslation();
  const addressExplorerUrl = useBlockchainExplorerURL(
    lpToken?.chain.chainId,
    lpToken?.address,
  );
  const { contrastTextColor: protocolImageContrastColor } =
    useGetContrastTextColor(protocol?.logo || '');

  const isAvatarLoading = !protocolAvatarLoaded;

  if (isLoading) {
    return <ProtocolCardSkeleton fullWidth={fullWidth} />;
  }

  const headerContent = (
    <ProtocolCardContentHeaderContainer>
      <ProtocolCardTitleContainer>
        <Typography variant="titleMedium">{title}</Typography>
        {addressExplorerUrl && (
          <Badge
            variant={BadgeVariant.Alpha}
            size={BadgeSize.MD}
            label="Contract"
            startIcon={<CodeRoundedIcon />}
            onClick={() => openInNewTab(addressExplorerUrl)}
          />
        )}
      </ProtocolCardTitleContainer>
      <ProtocolCardTagsContainer>
        {tags?.map((tag) => (
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.MD}
            label={tag}
            key={tag}
          />
        ))}
      </ProtocolCardTagsContainer>
    </ProtocolCardContentHeaderContainer>
  );

  return (
    <>
      <ProtocolCardContainer
        data-testid="protocol-card"
        sx={{
          width: '100%',
          maxWidth: fullWidth ? '100%' : PROTOCOL_CARD_SIZES.CARD_WIDTH,
        }}
      >
        <ProtocolCardHeaderContainer
          backgroundUrl={protocol?.logo || ''}
          sx={{
            width: '100%',
            maxWidth: fullWidth ? '100%' : PROTOCOL_CARD_SIZES.CARD_WIDTH,
            height: PROTOCOL_CARD_SIZES.IMAGE_HEIGHT,
          }}
        >
          {headerBadge && (
            <ProtocolCardHeaderBadgeContainer>
              {headerBadge}
            </ProtocolCardHeaderBadgeContainer>
          )}
          <ProtocolCardHeaderContentContainer
            sx={{
              opacity: isAvatarLoading ? 0 : 1,
              transition: 'opacity 0.2s ease-in',
            }}
          >
            {protocol?.logo && (
              <ProtocolCardProtocolAvatar
                src={protocol?.logo || ''}
                alt={protocol?.name || 'Protocol Logo'}
                height={56}
                width={56}
                onLoad={() => setProtocolAvatarLoaded(true)}
              />
            )}
            <ProtocolCardProtocolTitle
              sx={{
                color: protocolImageContrastColor,
              }}
            >
              {protocol?.name ? capitalizeString(protocol.name) : ''}
            </ProtocolCardProtocolTitle>
          </ProtocolCardHeaderContentContainer>
        </ProtocolCardHeaderContainer>
        <ProtocolCardContentContainer>
          {headerContent}
          <ProtocolCardDescription
            text={description}
            onSeeMoreClick={() => setIsDescriptionModalOpen(true)}
          />
        </ProtocolCardContentContainer>
      </ProtocolCardContainer>
      <ProtocolCardDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      >
        {headerContent}
        <ProtocolCardDescriptionContainer variant="bodyMediumParagraph">
          {description}
        </ProtocolCardDescriptionContainer>
      </ProtocolCardDescriptionModal>
    </>
  );
};
