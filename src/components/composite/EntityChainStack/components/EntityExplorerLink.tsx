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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    openInNewTab(explorerUrl);
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      onClick={handleClick}
    >
      <Typography variant="bodyXSmall" color="text.secondary">
        {truncateAddress(address, 5, 3)}
      </Typography>
      <OpenInNewRoundedIcon sx={{ width: 12, height: 12, color: 'iconHint' }} />
    </Stack>
  );
};
