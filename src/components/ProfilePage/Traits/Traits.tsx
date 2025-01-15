import { TraitsContainer, TraitsItem, TraitsRemaining } from './Traits.style';
import { TraitsInfoBadge } from './TraitsInfoBadge';

const MAX_DISPLAY_TRAITS = 5;

export const Traits = ({ traits }: { traits: string[] }) => {
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
      {remainingCount > 0 && (
        <TraitsRemaining variant="bodyXSmallStrong">
          +{remainingCount}
        </TraitsRemaining>
      )}
    </TraitsContainer>
  );
};
