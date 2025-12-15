import { useMutation } from '@tanstack/react-query';

interface NewsletterSubscribeDto {
  email: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referringSite?: string;
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

interface NewsletterSubscribeResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function subscribeToNewsletterQuery(
  props: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponse> {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Subscription failed');
  }

  return data;
}

export const useNewsletterSubscribe = () => {
  return useMutation({
    mutationKey: ['newsletter', 'subscribe'],
    mutationFn: (props: NewsletterSubscribeDto) => {
      return subscribeToNewsletterQuery(props);
    },
  });
};
