export const selectCardStyles = {
  padding: 0,
  borderRadius: 0,
  boxShadow: 'none',
  background: 'transparent',
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
  },
} as const;

export const descriptionBoxStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 0.5,
} as const;
