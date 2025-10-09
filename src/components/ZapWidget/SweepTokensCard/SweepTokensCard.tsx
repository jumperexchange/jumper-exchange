import { FC, useMemo } from 'react';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { useSweepTokens } from 'src/hooks/zaps/useSweepTokens';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { CustomInformation } from 'src/types/loyaltyPass';
import { ProjectData } from 'src/types/questDetails';
import { Button } from 'src/components/Button';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import {
  SweepTokenAmountContainer,
  SweepTokenContainer,
  SweepTokensCardContentContainer,
  SweepTokensCardContainer,
  SweepTokensContainer,
  SweepTokensCardTitleContainer,
} from './SweepTokensCard.styles';
import Typography from '@mui/material/Typography';
import {
  currencyFormatter,
  toFixedFractionDigits,
} from 'src/utils/formatNumbers';
import { openInNewTab } from 'src/utils/openInNewTab';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/nextjs';
import { BICONOMY_EXPLORER } from 'src/const/explorers';

interface SweepTokensCardProps {
  customInformation?: CustomInformation;
}

export const SweepTokensCard: FC<SweepTokensCardProps> = ({
  customInformation,
}) => {
  const { t } = useTranslation();
  const projectData: ProjectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    isSweeping,
    isSweepingTxInProgress,
    hasTokensToSweep,
    sweepTokens,
    txHash,
    isTransactionReceiptSuccess,
    isTransactionReceiptLoading,
    sweepStepButtonKey,
    sweepableTokens,
  } = useSweepTokens(projectData);

  const formattedSweepableTokens = useMemo(() => {
    return sweepableTokens.map((token) => {
      return {
        ...token,
        logo: token.logoURI ?? '',
        chain: {
          chainId: token.chainId,
          chainKey: token.chainName,
        },
      };
    });
  }, [sweepableTokens]);

  if (!hasTokensToSweep) {
    return null;
  }

  const onClickHandler = async () => {
    if (txHash) {
      openInNewTab(
        `${BICONOMY_EXPLORER.URL}/${BICONOMY_EXPLORER.TX_PATH}/${txHash}`,
      );
      return;
    }

    try {
      await sweepTokens();
    } catch (error) {
      console.error('Sweep failed:', error);
      Sentry.captureException(error, {
        tags: {
          component: 'SweepTokensCard',
          action: 'onClickHandler',
        },
      });
    }
  };

  const isSuccess = txHash && isTransactionReceiptSuccess;

  const cardContent = isSuccess
    ? {
        status: 'success' as const,
        icon: <CheckIcon />,
        title: t('widget.sweepTokensCard.success.title'),
        description: t('widget.sweepTokensCard.success.description'),
      }
    : {
        status: 'error' as const,
        icon: <ErrorIcon />,
        title: t('widget.sweepTokensCard.error.title'),
        description: t('widget.sweepTokensCard.error.description'),
      };

  return (
    <SectionCardContainer>
      <SweepTokensCardContainer>
        <SweepTokensCardTitleContainer status={cardContent.status}>
          {cardContent.icon}
          <Typography variant="title2XSmall">{cardContent.title}</Typography>
        </SweepTokensCardTitleContainer>
        <Typography variant="bodySmall" fontWeight="500">
          {cardContent.description}
        </Typography>
        <SweepTokensCardContentContainer>
          <SweepTokensContainer>
            {formattedSweepableTokens.map((token) => (
              <SweepTokenContainer key={`${token.address}-${token.chainId}`}>
                <EntityChainStack
                  variant={EntityChainStackVariant.Tokens}
                  tokens={[token]}
                  tokensSize={AvatarSize.XL}
                  content={{
                    title: token.name,
                  }}
                />
                <SweepTokenAmountContainer>
                  <Typography variant="bodyLargeStrong">
                    {currencyFormatter('en-US', {
                      notation: 'compact',
                      currency: 'USD',
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })(parseFloat(token.amountUSD))}
                  </Typography>
                  <Typography variant="bodyXSmall" color="textSecondary">
                    {`${toFixedFractionDigits(parseFloat(token.amount), 2, 6)} ${token.symbol}`}
                  </Typography>
                </SweepTokenAmountContainer>
              </SweepTokenContainer>
            ))}
          </SweepTokensContainer>
          <Button
            variant="transparent"
            size="medium"
            fullWidth
            loading={isSweepingTxInProgress || isTransactionReceiptLoading}
            loadingPosition="start"
            disabled={isSweeping}
            onClick={onClickHandler}
            styles={(theme) => ({
              background: (theme.vars || theme).palette.alphaLight100.main,
              ...theme.applyStyles('light', {
                background: (theme.vars || theme).palette.alphaDark100.main,
              }),
            })}
          >
            {t(sweepStepButtonKey)}
          </Button>
        </SweepTokensCardContentContainer>
      </SweepTokensCardContainer>
    </SectionCardContainer>
  );
};
