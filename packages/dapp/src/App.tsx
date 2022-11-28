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
          <Route path="/" element={<Navigate to="/swap/" />} />
          <Route path="/swap/*" element={<Swap />} />
          <Route path="/gas/*" element={<Refuel />} />
        </Routes>
      </BrowserRouter>
    </BackgroundGradient>
  );
}
