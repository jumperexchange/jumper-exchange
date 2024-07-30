'use client';

import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

import { useTranslation } from 'react-i18next';
import { type Theme, useMediaQuery, Box } from '@mui/material';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';
import { FlexCenterRowBox } from '../SuperfestMissionPage.style';
import { useAccounts } from 'src/hooks/useAccounts';
import { useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import {
  CTAExplanationBox,
  SeveralMissionCtaContainer,
} from '../CTA/MissionCTA.style';

interface SignatureInt {
  isLive: boolean;
  message: string;
}

interface SignatureCtaProps {
  signature?: SignatureInt;
}

export const SignatureCTA = ({ signature }: SignatureCtaProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { account } = useAccounts();
  const [messageToSign, setMessageToSign] = useState<string | undefined>(
    undefined,
  );
  const [isTurtleLoading, setIsTurtleLoading] = useState(false);
  const [isTurtleSuccess, setIsTurtleSuccess] = useState(false);
  const [isTurtleFailure, setIsTurtleFailure] = useState(false);
  const { data, isError, isSuccess, signMessageAsync } = useSignMessage();

  const handleSignatureClick = async () => {
    try {
      const POST_ENDPOINT = 'https://points.turtle.club/user/verify_siwe';
      if (messageToSign && account && account.address) {
        const sig = await signMessageAsync({
          account: account.address as `0x${string}`,
          message: messageToSign,
        });
        console.log(sig);
        const payload = {
          message: messageToSign, // same message as from before
          signature: sig, // hex signature
          referral: 'JUMPER', // referral string
        };
        console.log(payload);
        const res = await fetch(POST_ENDPOINT, {
          body: JSON.stringify(payload),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`);
        }

        const json = await res.json();
        console.log(json);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function fetchMessage() {
      try {
        const GET_ENDPOINT = 'https://points.turtle.club/user/siwe_message';
        const response = await fetch(`${GET_ENDPOINT}`);
        const message = await response.text();
        if (message) {
          setMessageToSign(message);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchMessage();
  }, []);

  return (
    <>
      {true ? (
        <Box sx={{ width: '100%', marginBottom: '16px' }}>
          <SeveralMissionCtaContainer onClick={handleSignatureClick}>
            <CTAExplanationBox>
              <Image
                src={'https://strapi.li.finance/uploads/turtle_ef319715fe.jpg'}
                alt={`logo image`}
                width={48}
                height={48}
                style={{ borderRadius: 100 }}
                priority={false}
              />
              <SoraTypography
                fontSize={{ xs: '16px', sm: '22px' }}
                fontWeight={700}
                marginLeft={'16px'}
              >
                {signature?.message ?? 'Sign Message'}
              </SoraTypography>
            </CTAExplanationBox>
          </SeveralMissionCtaContainer>
        </Box>
      ) : undefined}
    </>
  );
};
