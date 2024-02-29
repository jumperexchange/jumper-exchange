export const CarouselNavigationButton = styled(IconButtonTertiary, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: 22,
}));
