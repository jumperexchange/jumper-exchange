import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { ContentContainer } from '@/components/composite/JumperWidget/JumperWidget.style';
import { EntityStackWithBadgeSkeleton } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadgeSkeleton';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { ReactNode } from 'react';

interface PortfolioSelectFieldProps<T> {
  label: string;
  placeholder: string;
  item: T | null;
  renderStartAdornment: (item: T) => ReactNode;
  renderEndAdornment?: (item: T) => ReactNode;
  skeletonAnimation?: 'pulse' | 'wave' | false;
  onClick: () => void;
}

export function PortfolioSelectField<T>({
  item,
  label,
  placeholder,
  renderStartAdornment,
  renderEndAdornment,
  skeletonAnimation = false,
  onClick,
}: PortfolioSelectFieldProps<T>) {
  return (
    <ContentContainer sx={{ paddingBottom: 2 }}>
      <SelectCard
        label={label}
        // When an item is selected, EntityStackWithBadge owns the content display
        // (title + hint). The placeholder is only shown when no item is selected.
        value={undefined}
        placeholder={item ? undefined : placeholder}
        placeholderVariant="bodyLarge"
        mode={SelectCardMode.Display}
        startAdornment={
          item ? (
            renderStartAdornment(item)
          ) : (
            <EntityStackWithBadgeSkeleton
              size={AvatarSize.XL}
              badgeSize={AvatarSize.XS}
              isContentVisible={false}
              animation={skeletonAnimation}
              avatarSx={{
                backgroundColor: (theme) =>
                  (theme.vars || theme).palette.alpha300.main,
              }}
            />
          )
        }
        endAdornment={
          item && renderEndAdornment ? renderEndAdornment(item) : undefined
        }
        onClick={onClick}
        sx={(theme) => ({
          background: (theme.vars || theme).palette.surface1.main,
        })}
      />
    </ContentContainer>
  );
}
