import React from 'react';
import { ButtonStyled } from './Button.styled';

export const Button = (props) => {
  return <ButtonStyled {...props}>{props.children}</ButtonStyled>;
};
