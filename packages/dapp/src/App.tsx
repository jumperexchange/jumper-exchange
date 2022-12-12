import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BackgroundGradient from './components/BackgroundGradient/BackgroundGradient';
import { Navbar } from './components/Navbar';
import Refuel from './pages/Refuel';
import Swap from './pages/Swap';

export default function App() {
  return (
    <BackgroundGradient>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/transferto.xyz/swap/*" element={<Swap />} />
          <Route path="/transferto.xyz/gas/*" element={<Refuel />} />
          <Route path="/*" element={<Navigate to="/transferto.xyz/swap/" />} />
        </Routes>
      </BrowserRouter>
    </BackgroundGradient>
  );
}
