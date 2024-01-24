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
  console.log('handleNavigationIndex:', {
    direction,
    active,
    max,
  });
  switch (direction) {
    case 'prev':
      console.log('prev:', { active, max }, active > 0 ? active - 1 : max - 1);
      return active > 0 ? active - 1 : max - 1;
    case 'next':
      console.log('next:', { active, max }, active < max - 1 ? active + 1 : 0);
      return active + 1 < max ? active + 1 : 0;
    default:
      return undefined;
  }
};
