import type { ReactElement } from 'react';
import { PaginationLink } from './Pagination.style';
import { PaginationButtonNavigator } from './PaginationNavigator.style';

interface PaginationNavigatorProps {
  icon: ReactElement;
  disabled: boolean;
  href: string;
}

export const PaginationNavigator = ({
  icon,
  disabled,
  href,
}: PaginationNavigatorProps) => {
  if (disabled) {
    return (
      <PaginationButtonNavigator disabled={disabled}>
        {icon}
      </PaginationButtonNavigator>
    );
  }

  return (
    <PaginationLink href={href}>
      <PaginationButtonNavigator>{icon}</PaginationButtonNavigator>
    </PaginationLink>
  );
};
