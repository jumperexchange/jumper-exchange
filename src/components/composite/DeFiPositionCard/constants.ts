export const ICON_STYLES = {
  height: 16,
  width: 16,
};

export const COLUMN_SPACING = {
  chains: -0.8,
  infoContainerGap: 4,
};

export const GRID_SIZES = {
  entityColumn: { xs: 6, md: 'grow' as const },
  valueColumn: { xs: 6, md: 'grow' as const },
  apyColumn: { xs: 12, md: 'grow' as const },
  actionsColumn: { xs: 12, md: 'grow' as const },
};

export const TYPOGRAPHY_VARIANTS = {
  title: 'titleXSmall',
  description: 'bodyXSmall',
} as const;
