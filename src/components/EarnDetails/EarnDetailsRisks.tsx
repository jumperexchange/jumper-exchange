'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { Typography } from '@mui/material';

import type { Protocol } from 'src/types/jumper-backend';
import { ExternalLink } from 'src/components/Link/ExternalLink';

import type Resources from '../../i18n/resources';
import { capitalizeString } from '../../utils/capitalizeString';
import {
  EarnDetailsRisksNavButton,
  EarnDetailsRisksContainer,
  EarnRiskMissingWarning,
  EarnRiskTagsContainer,
} from './EarnDetails.styles';

// Eventually we want to get those from the API
type RiskTag =
  keyof Resources['translation']['earn']['riskDescriptions']['riskTag'];

interface EarnDetailsRisksProps {
  protocol: Protocol;
  tags: string[];
}

export const EarnDetailsRisks: React.FC<EarnDetailsRisksProps> = ({
  protocol,
  tags,
}) => {
  const { t } = useTranslation();

  const [selectedTag, setSelectedTag] = useState<RiskTag>(tags[0] as RiskTag);

  const tabOptions = tags.map((tag) => {
    const label = `${tag} ${t('earn.riskDescriptions.risk')}` || (
      <EarnRiskMissingWarning>
        ATTENTION! Risk description for {tag} is missing! Please provide this.
      </EarnRiskMissingWarning>
    );
    return {
      value: tag,
      label,
    };
  });

  const handleTabChange = useCallback((value: string) => {
    setSelectedTag(value as RiskTag);
  }, []);

  const riskDescription = protocol.riskDescription || (
    <EarnRiskMissingWarning>
      ATTENTION! Risk description missing! Please provide this.
    </EarnRiskMissingWarning>
  );
  const tagRiskDescription = t(`earn.riskDescriptions.riskTag.${selectedTag}`);
  const protocolName = useMemo(
    () => capitalizeString(protocol.name),
    [protocol.name],
  );
  const linkText = `${protocolName} ${t('earn.riskDescriptions.website')}`;

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
          {capitalizeString(protocol.name)}
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({ marginBottom: theme.spacing(2) })}
        >
          {riskDescription}
        </Typography>
        {protocol.url && (
          <ExternalLink href={protocol.url}>
            {linkText} <OpenInNew />
          </ExternalLink>
        )}
      </Stack>
      <EarnRiskTagsContainer>
        <Box sx={(theme) => ({ marginBottom: theme.spacing(4) })}>
          {tabOptions.map((tab) => (
            <EarnDetailsRisksNavButton
              isActive={selectedTag === tab.value}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </EarnDetailsRisksNavButton>
          ))}
        </Box>
        <Typography variant="body2">{tagRiskDescription}</Typography>
      </EarnRiskTagsContainer>
    </EarnDetailsRisksContainer>
  );
};
