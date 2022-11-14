import { defaultSettings } from '@transferto/shared/src/config';
import { SettingsProvider } from '@transferto/shared/src/contexts/SettingsContext';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BackgroundGradient from './components/BackgroundGradient/BackgroundGradient';
import { Navbar } from './components/Navbar';
import Swap from './pages/Swap';
import { I18NProvider } from './providers/I18nProvider';

export default function App() {
  return (
    <I18NProvider>
      <SettingsProvider defaultSettings={defaultSettings}>
        <BackgroundGradient>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/swap/" />} />
              <Route path="/swap/*" element={<Swap />} />
            </Routes>
          </BrowserRouter>
        </BackgroundGradient>
      </SettingsProvider>
    </I18NProvider>
  );
}
