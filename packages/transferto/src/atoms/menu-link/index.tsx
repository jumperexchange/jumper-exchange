import { Link as MUILink, styled } from '@mui/material';
import Link from 'next/link';

export type MenuLinkProps = {
  href: string;
  children: React.ReactNode;
};

const MUIMenuLink = styled(MUILink)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: `auto ${theme.spacing(2)} auto ${theme.spacing(2)}`,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.brandPrimaryTint100.main,
  },
}));

export const MenuLink = ({ href, children }: MenuLinkProps) => {
  return (
    <Link href={href}>
      <MUIMenuLink variant="bodyLinkM">{children}</MUIMenuLink>
    </Link>
  );
};
