'use client';

import { useAccount } from '@lifi/wallet-management';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useTurtleMember } from 'src/hooks/useTurtleMember';
import { useSignMessage } from 'wagmi';
import { defaultConfig, prepareSignup, signup } from '@turtledev/api';
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
}

export const SignatureCTA = ({ signature }: SignatureCtaProps) => {
  const { account } = useAccount();
  const [messagedHasBeenSigned, setMessagedHasBeenSigned] =
    useState<boolean>(false);
  const { signMessageAsync } = useSignMessage();
  const { isMember, refetchMember, refetchJumperMember } = useTurtleMember({
    userAddress: account?.address,
  });

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
        network: '1', // Turtle is available only on Ethereum mainnet
      };
      const isSignupSuccess = await signup(signupOptions, defaultConfig);
      if (!isSignupSuccess) {
        throw new Error(`Invalid signature`);
      }
      setMessagedHasBeenSigned(true);
      await refetchMember();
      await refetchJumperMember();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {(messagedHasBeenSigned || isMember) && (
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
              <Typography
                fontSize={{ xs: '16px', sm: '22px' }}
                fontWeight={700}
                marginLeft={'16px'}
              >
                {
                  'Congrats, you are a Turtle Club member now. Pour some whisky and enjoy the boosted yields on your existing DeFi positions.'
                }
              </Typography>
            </CTAExplanationBox>
          </SeveralMissionCtaContainer>
        </Box>
      )}
      {!messagedHasBeenSigned && !isMember && (
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
              <Typography
                fontSize={{ xs: '16px', sm: '22px' }}
                fontWeight={700}
                marginLeft={'16px'}
              >
                {'Click to sign the agreement to become part of the club.'}
              </Typography>
            </CTAExplanationBox>
          </SeveralMissionCtaContainer>
        </Box>
      )}
    </>
  );
};
