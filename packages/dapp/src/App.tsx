import { styled } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Swap from './pages/Swap';

import BG from './assets/bg/bg-net.svg';
import BackgroundGradient from './components/BackgroundGradient/BackgroundGradient';

const AppContainer = styled('div')(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.background.default} 9.96%, ${theme.palette.brandSecondary.light} 100%)`,
  backgroundImage: `url(${BG}), linear-gradient(180deg, ${theme.palette.background.default} 9.96%, ${theme.palette.brandSecondary.light} 100%) !important`,
  backgroundSize: 'contain !important',
  backgroundRepeat: 'no-repeat !important',
  backgroundPosition: 'bottom !important',
  minHeight: '100vh',
}));

export default function App() {
  return (
    <BackgroundGradient>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/swap/" />} />
          <Route path="/swap/*" element={<Swap />} />
        </Routes>
      </BrowserRouter>
    </BackgroundGradient>
  );
}
