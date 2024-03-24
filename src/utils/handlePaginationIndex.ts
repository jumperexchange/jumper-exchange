export interface HandleNavigationIndexProps {
  direction: DirectionProps;
  active: number;
  max: number;
}

export type DirectionProps = 'prev' | 'next';

export const handleNavigationIndex = ({
  direction,
  active,
  max,
}: HandleNavigationIndexProps): number | undefined => {
  switch (direction) {
    case 'prev':
      return active > 0 ? active - 1 : max - 1;
    case 'next':
      return active + 1 < max ? active + 1 : 0;
    default:
      return undefined;
  }
};
