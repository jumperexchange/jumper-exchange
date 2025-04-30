import { Stack } from '@mui/material';
export const WalletCardStack = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ flexGrow: 1 }}
      spacing={1}
      width="100%"
    >
      {children}
    </Stack>
  );
};
