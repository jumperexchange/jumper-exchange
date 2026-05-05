'use client';
import { useState } from 'react';
import { DustBanner } from './DustBanner';
import { DustModal } from './DustModal';

export const DustFlow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <DustBanner onClick={() => setIsModalOpen(true)} />
      <DustModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
