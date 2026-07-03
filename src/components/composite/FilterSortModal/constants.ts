import type { Theme } from '@mui/material/styles';

export const clearIconButtonSx = {
  width: 40,
  '&.MuiButtonBase-root svg': {
    height: 22,
    width: 22,
  },
};

export const sectionCardSx = {
  maxHeight: `calc(100vh - 10rem)`,
  height: 570,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const categoryListSx = {
  width: 200,
  overflowY: 'auto',
};

export const categoryListItemSx = (theme: Theme, isSelected: boolean) => ({
  background: isSelected
    ? (theme.vars || theme).palette.surface1Hover
    : 'transparent',
  transition: 'background .2s ease-in',
  borderRadius: theme.shape.radius24,
  height: 40,
  padding: theme.spacing(1.125, 1.25, 1.125, 2.25),
  '& svg': {
    height: 22,
    width: 22,
  },
  '&:hover': {
    background: (theme.vars || theme).palette.surface1Hover,
  },
});

export const leafCategoryContainerSx = {
  width: 264,
  '& .MuiStack-root': {
    overflowY: 'auto',
  },
};

export const leafCategorySlotProps = {
  searchSize: 'small' as const,
  searchSx: {
    padding: 0,
  },
  listSpacing: 1,
  itemSx: (theme: Theme) => ({
    paddingX: 1,
    paddingY: 0.75,
    transition: 'background .2s ease-in',
    borderRadius: theme.shape.radius24,
    '& svg:last-of-type': {
      height: 16,
      width: 16,
    },
    '&:hover': {
      background: (theme.vars || theme).palette.surface1Hover,
    },
  }),
};

export const clearButtonSx = {
  minWidth: 'fit-content',
};

export const selectBadgeSx = {
  alignSelf: 'center',
};
