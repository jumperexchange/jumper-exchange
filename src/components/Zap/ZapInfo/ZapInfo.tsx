'use client';

import { BackButton } from '@/components/Zap/BackButton/BackButton';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { ZapActionFaq } from './ZapActionFaq';
import { ZapDisclaimerInfo } from './ZapDisclaimerInfo';
import { ZapProtocolActionInfoBox } from './ZapInfo.style';
import { ZapProtocolIntro } from './ZapProtocolIntro';

interface ZapPageProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapInfo = ({ market, detailInformation }: ZapPageProps) => {
  return (
    <ZapProtocolActionInfoBox>
      <BackButton title={'Profile'} />
      {/* Main Information about the protocol */}
      <ZapProtocolIntro market={market} detailInformation={detailInformation} />

      {/* FAQ about the Zap and the pool */}
      {detailInformation?.faqItems && (
        <ZapActionFaq detailInformation={detailInformation} />
      )}

      {/* Disclaimer about the pool */}
      {market?.Information && <ZapDisclaimerInfo market={market} />}
    </ZapProtocolActionInfoBox>
  );
};
