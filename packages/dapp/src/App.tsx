import { styled } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Home';
import Swap from './pages/Swap';

import BG from './assets/bg/bg-net.svg';
import '@transferto/dashboard-vite/dist/style.css';

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
    <AppContainer>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/swap/*" element={<Swap />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
}
