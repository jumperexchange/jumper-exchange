'use client';
import { notFound } from 'next/navigation';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { useAccount } from '@lifi/wallet-management';

const Page = () => {
  const variant = 'private';

  const { account } = useAccount();
  const privateSwapsFeatureFlag = useABTest({
    feature: AB_TEST_NAME.PRIVATE_SWAPS,
    address: account?.address ?? '',
  });

  if (
    !privateSwapsFeatureFlag.isLoading &&
    !privateSwapsFeatureFlag.isEnabled
  ) {
    return notFound();
  }

  return (
    <MainWidgetContainer>
      <Widget
        starterVariant={variant}
        isLoading={privateSwapsFeatureFlag.isLoading}
      />
      <Widgets />
    </MainWidgetContainer>
  );
};

export default Page;
