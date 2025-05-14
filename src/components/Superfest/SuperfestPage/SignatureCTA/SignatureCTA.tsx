'use client';

import { useAccount } from '@lifi/wallet-management';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SiweMessage, generateNonce } from 'siwe';
import { useSignMessage } from 'wagmi';
import { SoraTypography } from '../../Superfest.style';
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
  isTurtleMember?: boolean;
}

export const SignatureCTA = ({
  signature,
  isTurtleMember,
}: SignatureCtaProps) => {
  const { account } = useAccount();
  const [messageToSign, setMessageToSign] = useState<string | undefined>(
    undefined,
  );
  const [messagedHasBeenSigned, setMessagedHasBeenSigned] =
    useState<boolean>(false);
  const { signMessageAsync } = useSignMessage();

  const handleSignatureClick = async () => {
    try {
      const POST_ENDPOINT = 'https://points.turtle.club/user/verify_siwe';
      if (messageToSign && account?.address) {
        const domain = 'jumper.exchange';
        const origin = 'https://jumper.exchange';
        const nonce = generateNonce();

        const siweMess = new SiweMessage({
          version: '1',
          domain,
          uri: origin,
          address: account.address,
          chainId: 1,
          statement: messageToSign,
          nonce,
        }).toMessage();

        const sig = await signMessageAsync({
          account: account.address as `0x${string}`,
          message: String(siweMess),
        });
        const payload = {
          message: siweMess, // same message as from before
          signature: sig, // hex signature
          referral: 'JUMPER', // referral string
        };
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
        if (res.status === 200) {
          setMessagedHasBeenSigned(true);
        }
      }
    } catch (err) {
      console.error(err);
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
        console.error(err);
      }
    }
    fetchMessage();
  }, []);

  return (
    <>
      {(messagedHasBeenSigned || isTurtleMember) && (
        <Box sx={{ width: '100%', marginBottom: '16px' }}>
          <SeveralMissionCtaContainer
            sx={{ cursor: 'not-allowed', '&:hover': { cursor: 'not-allowed' } }}
          >
            <CTAExplanationBox>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/turtle_ef319715fe.jpg`}
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
                {
                  'Congrats, you are a Turtle Club member now. Pour some whisky and enjoy the boosted yields on your existing DeFi positions.'
                }
              </SoraTypography>
            </CTAExplanationBox>
          </SeveralMissionCtaContainer>
        </Box>
      )}
      {!messagedHasBeenSigned && !isTurtleMember && (
        <Box sx={{ width: '100%', marginBottom: '16px' }}>
          <SeveralMissionCtaContainer onClick={handleSignatureClick}>
            <CTAExplanationBox>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/turtle_ef319715fe.jpg`}
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
                {'Click to sign the agreement to become part of the club.'}
              </SoraTypography>
            </CTAExplanationBox>
          </SeveralMissionCtaContainer>
        </Box>
      )}
    </>
  );
};
