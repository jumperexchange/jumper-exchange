import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
  BlogBackgroundGradient,
} from '.';

interface BackgroundGradientProps {
  variant?: 'blog';
}

export const BackgroundGradient = ({ variant }: BackgroundGradientProps) => {
  return variant === 'blog' ? (
    <BlogBackgroundGradient />
  ) : (
    <BackgroundGradientContainer>
      <BackgroundGradientBottomLeft />
      <BackgroundGradientBottomRight />
      <BackgroundGradientTopCenter />
    </BackgroundGradientContainer>
  );
};
