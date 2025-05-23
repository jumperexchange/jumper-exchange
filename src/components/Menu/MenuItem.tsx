import { ButtonSecondary } from '@/components/Button/Button.style';
import type { MenuKeysEnum } from '@/const/menuKeys';
import type { Breakpoint, SxProps, Theme } from '@mui/material';
import { Typography } from '@mui/material';
import type { MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { MenuItemContainer, MenuItemLink } from '.';
import { MenuItemLabel } from './MenuItemLabel';
import RouterLink from 'next/link';

export interface MenuItemLinkType {
  url: string;
  external?: boolean;
}

interface MenuItemProps {
  open: boolean;
  showButton: boolean | undefined;
  children?: ReactNode; // Update the type here
  disableRipple?: boolean | undefined;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  link?: MenuItemLinkType;
  label?: string;
  onClick?: MouseEventHandler<HTMLLIElement>;
  triggerSubMenu?: MenuKeysEnum;
  prefixIcon?: React.JSX.Element | string;
  suffixIcon?: React.JSX.Element | string;
}

export const MenuItem = ({
  open,
  showButton,
  autoFocus,
  disableRipple,
  children,
  showMoreIcon = true,
  link,
  styles,
  onClick,
  label,
  triggerSubMenu,
  prefixIcon,
  suffixIcon,
}: MenuItemProps) => {
  return open ? (
    <MenuItemContainer
      disableRipple={disableRipple || showButton}
      sx={styles}
      autoFocus={autoFocus}
      onClick={(event: MouseEvent<HTMLLIElement>) => {
        event.stopPropagation();
        if (!children) {
          onClick && onClick(event);
        }
      }}
    >
      <>
        {children}
        {showButton && (
          <ButtonSecondary fullWidth>
            {prefixIcon}
            <Typography
              variant={'bodyMediumStrong'}
              component={'span'}
              ml={!!prefixIcon ? '9.5px' : 'inherit'}
              mr={!!prefixIcon ? '9.5px' : 'inherit'}
              sx={(theme) => ({
                color: (theme.vars || theme).palette.white.main,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 208,
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  maxWidth: 168,
                },
                ...theme.applyStyles("light", {
                  color: (theme.vars || theme).palette.primary.main
                })
              })}
            >
              {label}
            </Typography>
            {suffixIcon ?? null}
          </ButtonSecondary>
        )}
        {!showButton && link?.url && (
          <MenuItemLink
            as={RouterLink}
            href={link.url}
            target={link.external ? '_blank' : '_self'}
          >
            <MenuItemLabel
              label={label}
              showMoreIcon={showMoreIcon}
              suffixIcon={suffixIcon}
              prefixIcon={prefixIcon}
            />
          </MenuItemLink>
        )}
        {!showButton && !link?.url && (
          <MenuItemLabel
            label={label}
            showMoreIcon={showMoreIcon}
            suffixIcon={suffixIcon}
            prefixIcon={prefixIcon}
          />
        )}
      </>
    </MenuItemContainer>
  ) : null;
};
