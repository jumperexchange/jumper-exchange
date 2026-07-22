import i18nConfig from 'i18n-config';
import { redirect } from 'next/navigation';
import { JUMPER_PERPS_TRADE_PATH } from '@/const/urls';

export default async function Page({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const prefix = lng === i18nConfig.defaultLocale ? '' : `/${lng}`;
  redirect(`${prefix}${JUMPER_PERPS_TRADE_PATH}`);
}
