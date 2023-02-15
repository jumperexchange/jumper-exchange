import { AppProvider } from './AppProvider';
import { DualWidget } from './components/DualWidget';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';

export default function App() {
  return (
    <AppProvider>
      <Navbar />
      <Menus />
      <DualWidget />
    </AppProvider>
  );
}
