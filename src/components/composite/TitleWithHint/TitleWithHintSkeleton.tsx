import {
  TitleWithHintContainer,
  TitleWithHintTypographySkeleton,
} from './TitleWithHint.styles';

export const TitleWithHintSkeleton = () => {
  return (
    <TitleWithHintContainer>
      <TitleWithHintTypographySkeleton variant="text" />
      <TitleWithHintTypographySkeleton variant="text" />
    </TitleWithHintContainer>
  );
};
