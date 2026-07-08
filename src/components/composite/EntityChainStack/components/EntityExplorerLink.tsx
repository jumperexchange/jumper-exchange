import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { truncateAddress } from '@/utils/addresses/truncateAddress';
import { openInNewTab } from '@/utils/openInNewTab';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import Stack from '@mui/material/Stack';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';

interface EntityExplorerLinkProps {
  address: string;
  chainId: string;
  hintVariant?: TypographyProps['variant'];
  hintColor?: TypographyProps['color'];
  prefix?: string;
  showIcon?: boolean;
}

export const EntityExplorerLink: FC<EntityExplorerLinkProps> = ({
  address,
  chainId,
  hintVariant = 'bodyXSmall',
  hintColor = 'text.secondary',
  prefix = 'address',
  showIcon = true,
}) => {
  const explorerUrl = useBlockchainExplorerURL(
    Number(chainId),
    address,
    prefix,
  );
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
      aria-label={`View on blockchain explorer for ${address}`}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      sx={{
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant={hintVariant}
        sx={{
          color: hintColor,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {truncateAddress(address, 5, 3)}
      </Typography>
      {showIcon && (
        <OpenInNewRoundedIcon
          sx={{ width: 12, height: 12, color: 'iconHint', flexShrink: 0 }}
        />
      )}
    </Stack>
  );
};
