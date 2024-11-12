import styled from '@emotion/styled';
import { Snackbar } from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';
import { IconInfo } from './icons/IconInfo';

import { colors } from '../utils/theme';
import { useWashTrading } from '../contexts/useWashTrading';

const StyledSnackbar = styled(Snackbar)`
  top: auto !important;
`;

const StyledContent = styled.div`
  display: flex;
  background-color: #8000ff4d;
  border: 1px solid ${colors.violet[800]};
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  gap: 1rem;
  max-width: 360px;
  align-items: center;
  backdrop-filter: blur(32px);
  box-shadow: 2px 2px 0px 0px #8000ff;
`;

const Message = styled.p`
  margin: 0;
  padding: 0;
  color: white;
  font-size: 16px;
  line-height: 20px;
`;
export function WashSnackbar(): ReactElement {
  const { mint, reveal } = useWashTrading();
  const [error, set_error] = useState<string | undefined>(undefined);

  useEffect(() => {
    set_error(mint.error || reveal.error);
  }, [mint.error, reveal.error]);

  const handleCloseSnackbar = () => {
    set_error(undefined);
  };

  return (
    <StyledSnackbar
      open={!!error}
      onClose={handleCloseSnackbar}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <StyledContent>
        <div style={{ minWidth: '23px' }}>
          <IconInfo color={colors.violet[800]} />
        </div>
        <Message>{error}</Message>
      </StyledContent>
    </StyledSnackbar>
  );
}
