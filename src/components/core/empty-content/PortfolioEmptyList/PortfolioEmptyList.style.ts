import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { ButtonPrimary } from '@/components/Button/Button.style';

export const PortfolioEmptyListContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

export const PortfolioEmptyListContentContainer = styled(Stack)(
  ({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(6.5),
    width: '100%',
    position: 'relative',
    zIndex: 1,
    '&:before': {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      top: theme.spacing(-2),
      left: '50%',
      width: '90%',
      height: `calc(100% + ${theme.spacing(2)})`,
      transform: 'translateX(-50%)',
      backgroundColor: (theme.vars || theme).palette.surface2.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.surface1.main,
      }),
      filter: 'blur(32px)',
    },
  }),
);

export const PortfolioEmptyListDescriptionContainer = styled(Stack)(
  ({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  }),
);

export const PortfolioEmptyListButton = styled(ButtonPrimary)(({ theme }) => ({
  height: 'auto',
  padding: theme.spacing(1.75, 2.75),
  ...theme.typography.bodyMediumStrong,
}));
