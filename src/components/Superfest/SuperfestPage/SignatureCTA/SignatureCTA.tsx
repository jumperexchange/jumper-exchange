'use client';

import { useAccount } from '@lifi/wallet-management';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useSignMessage } from 'wagmi';
import { defaultConfig, prepareSignup, signup } from '@turtledev/api';
import { SoraTypography } from '../../Superfest.style';
import {
  CTAExplanationBox,
  SeveralMissionCtaContainer,
} from '../CTA/MissionCTA.style';
import { JUMPER_REFERRAL } from 'src/const/quests';

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
  const [messagedHasBeenSigned, setMessagedHasBeenSigned] =
    useState<boolean>(false);
  const { signMessageAsync } = useSignMessage();

  const handleSignatureClick = async () => {
    try {
      if (!account?.address) {
        throw new Error('No account address found');
      }
      const prepareSignupOptions = {
        user: account.address,
      };
      const preparedSignupData = await prepareSignup(
        prepareSignupOptions,
        defaultConfig,
      );
      if (!preparedSignupData) {
        throw new Error('Failed to prepare signup data');
      }
      const signature = await signMessageAsync({
        account: account.address as `0x${string}`,
        message: preparedSignupData.sign_message,
      });
      const signupOptions = {
        user: account.address,
        signupToken: preparedSignupData.signup_token,
        signature,
        referral: JUMPER_REFERRAL,
        network: '1',
      };
      const isSignupSuccess = await signup(signupOptions, defaultConfig);
      if (!isSignupSuccess) {
        throw new Error(`Invalid signature`);
      }
      setMessagedHasBeenSigned(true);
    } catch (err) {
      console.error(err);
    }
  };

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
