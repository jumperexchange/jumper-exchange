import { Box, SxProps, Theme, useMediaQuery } from '@mui/material';
import { PropsWithChildren } from 'react';
import useClient from 'src/hooks/useClient';
import IconHeader from '../ProfilePage/Common/IconHeader';
import {
  ContainerHeader,
  ContainerInfos,
  Container as ContainerStyle,
  ContainerTitle,
} from './Container.style';

interface ContainerProps {
  title?: string;
  infoTooltip?: string;
  infoTitle?: string;
  sx?: SxProps<Theme>;
}

export const Container: React.FC<PropsWithChildren<ContainerProps>> = ({
  children,
  title,
  infoTooltip,
  infoTitle,
  sx,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isClient = useClient();

  return (
    <ContainerStyle sx={sx}>
      <ContainerHeader>
        <ContainerInfos>
          {title && (
            <ContainerTitle variant="headerMedium">{title}</ContainerTitle>
          )}
          {infoTitle && (
            <Box>
              {isClient && (
                <IconHeader
                  tooltipKey={infoTooltip || ''}
                  title={!isMobile ? infoTitle : undefined}
                />
              )}
            </Box>
          )}
        </ContainerInfos>
      </ContainerHeader>
      {children}
    </ContainerStyle>
  );
};
