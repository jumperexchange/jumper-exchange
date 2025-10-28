import { AvatarGroup, Skeleton, Stack } from '@mui/material';
import generateKey from '@/app/lib/generateKey';
import { PortfolioTokenSkeleton } from '../composite/PortfolioToken/PortfolioTokenSkeleton';

function PortfolioSkeleton() {
  return (
    <>
      <Stack>
        <Skeleton
          sx={(theme) => ({
            color: theme.palette.text.primary,
            textOverflow: 'ellipsis',
            fontWeight: '700',
            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            fontSize: '3rem',
            lineHeight: '4rem',
          })}
          variant="rectangular"
          width={210}
          height={60}
        />
        <Skeleton
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            textOverflow: 'ellipsis',
            fontWeight: '700',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
          })}
          variant="text"
          width={100}
          height={60}
        />
      </Stack>
      <Stack>
        {new Array(8).fill(undefined).map((token) => (
          <PortfolioTokenSkeleton key={generateKey('token')} />
        ))}
      </Stack>
    </>
  );
}

export default PortfolioSkeleton;
