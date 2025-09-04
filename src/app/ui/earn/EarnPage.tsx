import { notFound } from 'next/navigation';
import { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = async ({ slug }) => {
  // TODO: LF-14853: Opportunity Details
  const { data, error } = await getOpportunityBySlug(slug);
  if (error || !data) {
    return notFound();
  }

  return (
    <div>
      <h1>EarnPage</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
