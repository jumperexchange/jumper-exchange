import type { ParseKeys } from 'i18next';
import { Trans } from 'react-i18next';
import { ExternalLink } from '@/components/Link/ExternalLink';
import { EmptyComponent } from '@/components/core/EmptyComponent/EmptyComponent';

interface DisabledEarnFeatureTooltipProps {
  i18nKey: ParseKeys<'translation'>;
  protocolName?: string;
  protocolUrl?: string;
}

export const DisabledEarnFeatureTooltip = ({
  i18nKey,
  protocolName,
  protocolUrl,
}: DisabledEarnFeatureTooltipProps) => (
  <Trans<ParseKeys<'translation'>>
    i18nKey={i18nKey}
    values={{ protocolName }}
    components={[
      protocolUrl ? (
        <ExternalLink
          href={protocolUrl}
          sx={(theme) => ({
            fontSize: 'inherit',
            color: (theme.vars || theme).palette.textPrimaryInverted,
            textDecoration: 'underline',
            '& svg': {
              fontSize: 'inherit',
              width: '1em',
              height: '1em',
            },
            '&:hover': {
              color: (theme.vars || theme).palette.textPrimaryInverted,
            },
          })}
        />
      ) : (
        <EmptyComponent />
      ),
    ]}
  />
);
