import { useTraits } from 'src/hooks/useTraits';
import { TraitsContainer, TraitsItem, TraitsRemaining } from './Traits.style';
import { TraitsInfoBadge } from './TraitsInfoBadge';

const MAX_DISPLAY_TRAITS = 5;

export const Traits = ({
  hideMoreButton = false,
}: {
  hideMoreButton?: boolean;
}) => {
  const { traits } = useTraits();

  if (!traits || traits?.length < 1) {
    return null;
  }

  const displayTraits = traits.slice(0, MAX_DISPLAY_TRAITS);
  const remainingCount = Math.max(traits.length - MAX_DISPLAY_TRAITS, 0);

  return (
    <TraitsContainer>
      <TraitsInfoBadge />
      {displayTraits.map((trait, index) => (
        <TraitsItem key={index} variant="bodyXSmallStrong">
          {trait}
        </TraitsItem>
      ))}
      {!hideMoreButton && remainingCount > 0 && (
        <TraitsRemaining variant="bodyXSmallStrong" as={'a'} href="/traits">
          +{remainingCount}
        </TraitsRemaining>
      )}
    </TraitsContainer>
  );
};
