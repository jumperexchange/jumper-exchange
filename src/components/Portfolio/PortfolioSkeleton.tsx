import { AvatarGroup, Skeleton, Stack } from '@mui/material';
import generateKey from '@/app/lib/generateKey';

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
      <Stack spacing={2}>
        {new Array(8).fill(undefined).map((token) => (
          <Stack direction="row" gap="1rem" key={generateKey('token')}>
            <Skeleton variant="circular" width={40} height={40} />
            <Stack direction="column" alignItems="flex-start">
              <Skeleton
                variant="text"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  lineHeight: '1.5rem',
                })}
                width={100}
              />
              <AvatarGroup spacing={6}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '0.75rem' }}
                  width={30}
                />
              </AvatarGroup>
            </Stack>
            <Stack
              direction="column"
              flexGrow={1}
              textAlign="right"
              alignContent="flex-end"
              alignItems="flex-end"
              flexWrap="wrap"
            >
              <Skeleton
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  lineHeight: '1.5rem',
                })}
                variant="text"
                width={100}
              />
              <Skeleton
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  lineHeight: '1rem',
                })}
                variant="text"
                width={40}
                height={20}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  );
}

export default PortfolioSkeleton;
