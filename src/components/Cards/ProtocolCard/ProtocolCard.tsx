import { FC } from 'react';
import {
  ProtocolCardContainer,
  ProtocolCardContentContainer,
  ProtocolCardContentHeaderContainer,
  ProtocolCardDescriptionContainer,
  ProtocolCardHeaderBadgeContainer,
  ProtocolCardHeaderContainer,
  ProtocolCardHeaderContentContainer,
  ProtocolCardLink,
  ProtocolCardProtocolAvatar,
  ProtocolCardProtocolTitle,
  ProtocolCardTagsContainer,
} from './ProtocolCard.styles';
import { PROTOCOL_CARD_SIZES } from './constants';
import Typography from '@mui/material/Typography';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'src/utils/capitalizeString';
import { ProtocolCardSkeleton } from './ProtocolCardSkeleton';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { useGetContrastTextColor } from 'src/hooks/images/useGetContrastTextColor';

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
  const { protocol, tags, description, url } = data ?? {};
  const { t } = useTranslation();

  const protocolImageContrastColor = useGetContrastTextColor(
    protocol?.logo || '',
  );

  if (isLoading) {
    return <ProtocolCardSkeleton fullWidth={fullWidth} />;
  }
  return (
    <ProtocolCardContainer
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
        <ProtocolCardHeaderContentContainer>
          {protocol?.logo && (
            <ProtocolCardProtocolAvatar
              src={protocol?.logo || ''}
              alt={protocol?.name || 'Protocol Logo'}
              height={56}
              width={56}
            />
          )}
          <ProtocolCardProtocolTitle
            sx={{
              color: protocolImageContrastColor,
            }}
          >
            {protocol?.name}
          </ProtocolCardProtocolTitle>
        </ProtocolCardHeaderContentContainer>
      </ProtocolCardHeaderContainer>
      <ProtocolCardContentContainer>
        <ProtocolCardContentHeaderContainer>
          <Typography variant="titleMedium">
            {protocol?.product ?? protocol?.name}
          </Typography>
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
        <ProtocolCardDescriptionContainer>
          {description}
        </ProtocolCardDescriptionContainer>
        {protocol?.name && url && (
          <ProtocolCardLink target="_blank" href={url}>
            {t('links.discover', { name: capitalizeString(protocol?.name) })}
            <ArrowForwardIcon />
          </ProtocolCardLink>
        )}
      </ProtocolCardContentContainer>
    </ProtocolCardContainer>
  );
};
