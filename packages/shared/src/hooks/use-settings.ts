import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

// ----------------------------------------------------------------------

export const useSettings = () => useContext(SettingsContext);
