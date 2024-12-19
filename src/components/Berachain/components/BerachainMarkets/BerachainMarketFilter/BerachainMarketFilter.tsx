import { ClickAwayListener } from '@mui/material';
import Menu from '@mui/material/Menu';
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

interface BerachainMarketFilterProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  idLabel: string;
  idMenu: string;
  data?: any; //todo: set correct type
}

export const BerachainMarketFilter: FC<
  PropsWithChildren<BerachainMarketFilterProps>
> = ({
  open,
  setOpen,
  idLabel,
  idMenu,
  anchorEl,
  setAnchorEl,
  data,
  children,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    open && (
      <ClickAwayListener
        touchEvent={'onTouchStart'}
        mouseEvent={'onMouseDown'}
        onClickAway={() => {
          setTimeout(() => {
            handleClose();
          }, 150);
        }}
      >
        <Menu
          id={idMenu}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': idLabel,
            sx: {
              padding: 0,
            },
          }}
          slotProps={{
            paper: {
              sx: {
                padding: '12px 8px',
                minWidth: 144,
                borderRadius: '8px',
                border: '1px solid #383433',
                background: '#1E1D1C',
                '& .MuiList-root': {
                  padding: 0,
                },
              },
            },
          }}
        >
          {children}
        </Menu>
      </ClickAwayListener>
    )
  );
};
