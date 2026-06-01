import type { FC } from 'react';
import Stack from '@mui/material/Stack';

import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import type { VaultMessage } from '@/types/jumper-backend';
import { VaultMessageSeverity } from '@/types/jumper-backend';

const SEVERITY_TO_VARIANT: Record<VaultMessageSeverity, BaseAlertVariant> = {
  [VaultMessageSeverity.Info]: BaseAlertVariant.Info,
  [VaultMessageSeverity.Warning]: BaseAlertVariant.Warning,
  [VaultMessageSeverity.Critical]: BaseAlertVariant.Error,
};

interface EarnDetailsMessagesProps {
  messages: VaultMessage[];
}

export const EarnDetailsMessages: FC<EarnDetailsMessagesProps> = ({
  messages,
}) => {
  if (!messages.length) {
    return null;
  }

  return (
    <Stack spacing={1}>
      {messages.map((message, index) => (
        <BaseAlert
          key={`${index}-${message.publishedAt}-${message.content}`}
          variant={SEVERITY_TO_VARIANT[message.severity]}
          description={message.content}
        />
      ))}
    </Stack>
  );
};
