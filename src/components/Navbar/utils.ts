import { AppPaths } from '@/const/urls';

export const checkIsLearnPage = (pathname: string) => {
  return pathname.includes(AppPaths.Learn);
};

export const checkIsScanPage = (pathname: string) => {
  return (
    pathname.includes(AppPaths.Scan) ||
    pathname.includes(AppPaths.Tx) ||
    pathname.includes(AppPaths.Wallet)
  );
};

export const checkIsPrivacyPolicyPage = (pathname: string) => {
  return pathname.includes(AppPaths.PrivacyPolicy);
};
