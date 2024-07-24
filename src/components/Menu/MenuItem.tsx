import { ButtonSecondary } from '@/components/Button/Button.style';
import type { MenuKeysEnum } from '@/const/menuKeys';
import type { Breakpoint, SxProps, Theme } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { MenuItemContainer, MenuItemLink } from '.';
import { MenuItemLabel } from './MenuItemLabel';

export interface MenuItemLinkType {
  url: string;
  external?: boolean;
}
interface MenuItemProps {
  open: boolean;
  showButton: boolean | undefined;
  children?: Element | JSX.Element | undefined;
  disableRipple?: boolean | undefined;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  link?: MenuItemLinkType;
  label?: string;
  onClick?: MouseEventHandler<HTMLLIElement>;
  triggerSubMenu?: MenuKeysEnum;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
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
  const theme = useTheme();

  return open ? (
    <MenuItemContainer
      disableRipple={disableRipple || showButton}
      showButton={showButton || false}
      sx={styles}
      autoFocus={autoFocus}
      onClick={(event) => {
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
              variant={'lifiBodyMediumStrong'}
              component={'span'}
              ml={!!prefixIcon ? '9.5px' : 'inherit'}
              mr={!!prefixIcon ? '9.5px' : 'inherit'}
              sx={{
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.white.main,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 208,
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  maxWidth: 168,
                },
              }}
            >
              {label}
            </Typography>
            {suffixIcon ?? null}
          </ButtonSecondary>
        )}
        {!showButton && link?.url && (
          <MenuItemLink
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
