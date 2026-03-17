'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { Typography, useMediaQuery, type Theme } from '@mui/material';

import type { Protocol } from '@/types/jumper-backend';
import { ExternalLink } from '@/components/Link/ExternalLink';
import type Resources from '@/i18n/resources';
import { capitalizeString } from '@/utils/capitalizeString';

import {
  EarnDetailsRisksContainer,
  EarnRiskMissingWarning,
  EarnRiskSeeMoreButton,
  EarnRiskTagsContainer,
} from './EarnDetailsRisks.styles';
import { EarnRiskTagsNav } from './EarnRiskTagsNav';
import { EarnRiskTagsSelect } from './EarnRiskTagsSelect';
import { EarnRiskDisclaimerModal } from './EarnRiskDisclaimerModal';

// Eventually we want to get those from the API
export type RiskTag =
  keyof Resources['translation']['earn']['riskDescriptions']['riskTag'];

export type RiskDisclaimerType = 'protocol' | 'category' | null;

export type RiskTagOptions = { value: string; label: string }[];

interface EarnDetailsRisksProps {
  protocol: Protocol;
  tags: string[];
}

export const EarnDetailsRisks: React.FC<EarnDetailsRisksProps> = ({
  protocol,
  tags,
}) => {
  const { t } = useTranslation();
  const [riskDisclaimerType, setRiskDisclaimerType] =
    useState<RiskDisclaimerType>(null);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const [selectedTag, setSelectedTag] = useState<RiskTag>(tags[0] as RiskTag);

  const handleTagChange = useCallback((value: string) => {
    setSelectedTag(value as RiskTag);
  }, []);

  const protocolName = useMemo(
    () => capitalizeString(protocol.name),
    [protocol.name],
  );

  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        value: tag,
        label: `${tag} ${t('earn.riskDescriptions.risk')}`,
      })),
    [t, tags],
  );

  if (!tags.length) {
    return null;
  }

  const linkText = `${protocolName} ${t('earn.riskDescriptions.website')}`;

  const riskDescription = protocol.riskDescription || (
    <EarnRiskMissingWarning>
      ATTENTION! Risk description missing! Please provide this.
    </EarnRiskMissingWarning>
  );
  const tagRiskDescription = t(`earn.riskDescriptions.riskTag.${selectedTag}`);

  return (
    <EarnDetailsRisksContainer>
      <Stack
        sx={(theme) => ({
          flex: { md: 1 },
          paddingY: { sm: theme.spacing(2), md: theme.spacing(6) },
        })}
      >
        <Typography
          variant="headerXSmall"
          sx={(theme) => ({ marginBottom: theme.spacing(1) })}
        >
          {protocolName}
        </Typography>
        <Typography
          variant="bodyMediumParagraph"
          color="textSecondary"
          sx={(theme) => ({ marginBottom: theme.spacing(1) })}
        >
          {riskDescription}
        </Typography>
        <EarnRiskSeeMoreButton
          variant="text"
          size="small"
          onClick={() => setRiskDisclaimerType('protocol')}
          disableRipple
          sx={(theme) => ({ marginBottom: theme.spacing(3) })}
        >
          {t('earn.riskDescriptions.riskDisclaimer.seeDisclaimer', {
            type: t('labels.protocol').toLowerCase(),
          })}
        </EarnRiskSeeMoreButton>
        {protocol.url && (
          <ExternalLink href={protocol.url}>{linkText}</ExternalLink>
        )}
      </Stack>
      {selectedTag && (
        <EarnRiskTagsContainer>
          {isMobile ? (
            <EarnRiskTagsSelect
              onTagChange={handleTagChange}
              options={tagOptions}
              selectedTag={selectedTag}
            />
          ) : (
            <EarnRiskTagsNav
              onTagChange={handleTagChange}
              options={tagOptions}
              selectedTag={selectedTag}
            />
          )}
          <Typography variant="bodySmallParagraph" color="textSecondary">
            {tagRiskDescription}
          </Typography>
          <EarnRiskSeeMoreButton
            variant="text"
            size="small"
            onClick={() => setRiskDisclaimerType('category')}
            disableRipple
          >
            {t('earn.riskDescriptions.riskDisclaimer.seeDisclaimer', {
              type: t('labels.category').toLowerCase(),
            })}
          </EarnRiskSeeMoreButton>
        </EarnRiskTagsContainer>
      )}
      <EarnRiskDisclaimerModal
        selectedTag={selectedTag}
        type={riskDisclaimerType}
        onClose={() => setRiskDisclaimerType(null)}
      />
    </EarnDetailsRisksContainer>
  );
};
