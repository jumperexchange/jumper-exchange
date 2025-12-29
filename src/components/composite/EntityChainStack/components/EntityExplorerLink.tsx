import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { truncateAddress } from '@/utils/addresses/truncateAddress';
import { openInNewTab } from '@/utils/openInNewTab';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';

interface EntityExplorerLinkProps {
  address: string;
  chainId: string;
}

export const EntityExplorerLink: FC<EntityExplorerLinkProps> = ({
  address,
  chainId,
}) => {
  const explorerUrl = useBlockchainExplorerURL(Number(chainId), address);
  if (!explorerUrl) {
    return null;
  }

  return (
    <Stack
      component="a"
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      direction="row"
      spacing={0.5}
      alignItems="center"
      aria-label={`View on blockchain explorer for ${address}`}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      sx={{ cursor: 'pointer', textDecoration: 'none' }}
    >
      <Typography variant="bodyXSmall" color="text.secondary">
        {truncateAddress(address, 5, 3)}
      </Typography>
      <OpenInNewRoundedIcon sx={{ width: 12, height: 12, color: 'iconHint' }} />
    </Stack>
  );
};
