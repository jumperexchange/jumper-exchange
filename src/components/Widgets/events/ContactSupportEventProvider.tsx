'use client';
import { useContactSupportEvent } from './hooks/useContactSupportEvent';

export const ContactSupportEventProvider = () => {
  useContactSupportEvent();
  return null;
};
