import { scanParamsSchema } from '@/utils/validation-schemas';
import { notFound } from 'next/navigation';
import ScanPageContent from './ScanPageContent';

interface ScanPageProps {
  lng: string;
  segments: string[];
}

export default function ScanPage({ lng, segments }: ScanPageProps) {
  const result = scanParamsSchema.safeParse({ segments });

  if (!result.success) {
    notFound();
  }

  return <ScanPageContent lng={lng} />;
}
