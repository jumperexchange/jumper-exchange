import type { FC } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import type { VaultMessage } from '@/types/jumper-backend';
import { VaultMessageSeverity } from '@/types/jumper-backend';

const SEVERITY_TO_MUI: Record<
  VaultMessageSeverity,
  'info' | 'warning' | 'error'
> = {
  [VaultMessageSeverity.Info]: 'info',
  [VaultMessageSeverity.Warning]: 'warning',
  [VaultMessageSeverity.Critical]: 'error',
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
        <Alert
          key={`${index}-${message.publishedAt}-${message.content}`}
          severity={SEVERITY_TO_MUI[message.severity]}
        >
          {message.content}
        </Alert>
      ))}
    </Stack>
  );
};
