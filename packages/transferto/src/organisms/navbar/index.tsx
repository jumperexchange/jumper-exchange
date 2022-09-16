import { Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { MenuLink } from '../../atoms/menu-link';
import { MenuBrand, NavBar } from './navbar.styled';

export default function Navbar() {
  return (
    <>
      <NavBar position="static">
        <Toolbar>
          <MenuBrand href="/swap" variant="bodyBoldL">
            Transferto
          </MenuBrand>

          <MenuLink href="/swap">Swap & Bridge</MenuLink>

          <MenuLink href="/dashboard">Dashboard</MenuLink>
        </Toolbar>
      </NavBar>
    </>
  );
}
