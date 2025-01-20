import { ReactNode } from 'react';
import { Link, Typography } from '@mui/material';
import { BerachainBackButton } from '@/components/Berachain/Berachain.style';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton() {
  return (
    <Link href="/berachain/explore" style={{ textDecoration: 'none' }}>
      <BerachainBackButton>
        <ArrowBackIcon />
        <Typography variant="bodySmallStrong">Explore Berachain</Typography>
      </BerachainBackButton>
    </Link>
  );
}

export default BackButton;
