import { Tooltip, type SxProps, type Theme } from '@mui/material';
import { useTraits } from 'src/hooks/useTraits';
import { TraitsContainer, TraitsItem, TraitsRemaining } from './Traits.style';
import { TraitsInfoBadge } from './TraitsInfoBadge';

export const Traits = ({
  hideTooltip = true,
  maxDisplayTraits,
  sx,
}: {
  hideTooltip?: boolean;
  maxDisplayTraits?: number;
  sx?: SxProps<Theme>;
}) => {
  const { traits } = useTraits();

  if (!traits || traits?.length < 1) {
    return null;
  }

  let displayTraits = traits;
  if (maxDisplayTraits) {
    displayTraits = traits.slice(0, maxDisplayTraits);
  }
  const remainingCount = Math.max(traits.length - displayTraits.length, 0);

  return (
    <TraitsContainer sx={sx}>
      <TraitsInfoBadge />
      {displayTraits.map((trait, index) => (
        <Tooltip
          title={
            hideTooltip
              ? ''
              : 'Todo: This should be the explanation for a certain trait.'
          }
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <TraitsItem
            key={index}
            variant="bodyXSmallStrong"
            sx={{ ...(!hideTooltip && { cursor: 'help' }) }}
          >
            {trait}
          </TraitsItem>
        </Tooltip>
      ))}
      {maxDisplayTraits &&
        maxDisplayTraits < traits.length &&
        Math.max(traits.length - remainingCount, 0) > 0 && (
          <TraitsRemaining variant="bodyXSmallStrong" as={'a'} href="/traits">
            +{remainingCount}
          </TraitsRemaining>
        )}
    </TraitsContainer>
  );
};
