import { HttpError } from '@/types/http-error';
import { notFound, redirect } from 'next/navigation';
import { isProduction } from '@/utils/isProduction';

type Params = Promise<{ statusCode: string }>;

interface ErrorPreviewPageProps {
  params: Params;
}

export default async function ErrorPreviewPage({
  params,
}: ErrorPreviewPageProps) {
  if (isProduction) {
    return redirect('/');
  }
  const { statusCode } = await params;
  const statusCodeNum = Number(statusCode);

  if (Number.isNaN(statusCodeNum)) {
    return notFound();
  }

  throw new HttpError(
    'Error preview: intentional throw to test error page UI.',
    statusCodeNum,
  );
}
