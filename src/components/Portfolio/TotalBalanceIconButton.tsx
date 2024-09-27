import { alpha, IconButton } from '@mui/material';

interface TotalBalanceIconButtonProps {
  refetch: () => void;
  children: JSX.Element | JSX.Element[];
}

function TotalBalanceIconButton({
  refetch,
  children,
}: TotalBalanceIconButtonProps) {
  return (
    <IconButton
      size="small"
      aria-label="Refresh"
      sx={(theme) => ({
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.text.primary, 0.04),
        marginRight: 1,
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.primary, 0.08),
        },
      })}
      onClick={() => {
        refetch();
      }}
    >
      {children}
    </IconButton>
  );
}

export default TotalBalanceIconButton;
