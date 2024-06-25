import { useAccounts } from '@/hooks/useAccounts';

import { Box, Breakpoint, Stack, Typography, useTheme } from '@mui/material';
import { CenteredBox, SuperfestContainer } from '../Superfest.style';
import { Button, ButtonSecondary } from 'src/components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sequel85, sora } from 'src/fonts/fonts';
import { CustomRichBlocks } from 'src/components/Blog';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
// import { SuperfestPresentedByBox } from './SuperfestPresentedBy/SuperfestPresentedByBox';
import {
  BannerBottomBox,
  BannerMainBox,
  DescriptionBox,
  InformationBox,
  QuestDatesBox,
  XPDisplayBox,
  BannerTitleBox,
} from './SuperfestMissionPage.style';
import Image from 'next/image';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import { SuperfestXPIcon } from 'src/components/illustrations/XPIcon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import generateKey from 'src/app/lib/generateKey';
import { MissionCTA } from './CTA/MissionCTA';
// import { useRouter } from 'next/router';
import { JUMPER_FEST } from 'src/const/urls';

export const SuperfestMissionPage = ({ quest, baseUrl }: any) => {
  const theme = useTheme();
  // const router = useRouter();

  const attributes = quest?.attributes;

  console.log(attributes);

  return (
    <SuperfestContainer className="superfest">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* button to go back */}
        <Box
          sx={{
            width: '80%',
            display: 'flex',
            mb: '16px',
          }}
        >
          <Button
            size={'small'}
            onClick={() => {
              // router.push(JUMPER_FEST);
            }}
          >
            <ArrowBackIcon
              sx={{ color: '#FFFFFF', width: '16px', height: '16px' }}
            />
            <Typography
              component={'span'}
              ml={'4px'}
              mr={'4px'}
              sx={{
                fontSize: '14px',
                typography: sequel85.style.fontFamily,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 208,
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  maxWidth: 168,
                },
              }}
            >
              {'Back to Superfest'}
            </Typography>
          </Button>
        </Box>
        {/* big component with the main information */}
        <BannerMainBox>
          <Image
            src={
              'https://strapi.li.finance/uploads/Rectangle_1181_1f3f3b54b6.png'
            }
            alt="Quest Card Image"
            height={316}
            width={1300}
            style={{
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          />
          <BannerBottomBox>
            {/* date + chains */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              <QuestDatesBox>
                <CenteredBox>
                  <DateRangeRoundedIcon sx={{ height: '16px' }} />
                </CenteredBox>
                <ProfilePageTypography fontSize={'12px'} lineHeight={'16px'}>
                  July-Aug
                  {/* {getStringDateFormatted(startDate, endDate)} */}
                </ProfilePageTypography>
              </QuestDatesBox>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography>Supported chains</Typography>
                <Box
                  sx={{
                    ml: '8px',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {Array.from({ length: 3 }).map((elem, i) => {
                    return (
                      <Image
                        src="https://strapi.li.finance/uploads/base_314252c925.png"
                        style={{
                          marginLeft: i === 0 ? '' : '-8px',
                          zIndex: 100 - i,
                        }}
                        alt="base"
                        width="32"
                        height="32"
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <BannerTitleBox>
              <Typography
                sx={{
                  typography: sequel85.style.fontFamily,
                  fontSize: '56px',
                  fontWeight: 900,
                  lineHeight: '96px',
                }}
              >
                {'Deposit into Velodrome'}
              </Typography>
            </BannerTitleBox>
            {/* rewards  */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              {Array.from({ length: 3 }).map((elem, i) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                  >
                    <Image
                      src="https://strapi.li.finance/uploads/base_314252c925.png"
                      style={{}}
                      alt="base"
                      width="48"
                      height="48"
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                    >
                      <Typography>Rewards</Typography>
                      <Typography>165,000</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </BannerBottomBox>
        </BannerMainBox>
        {/* Subtitle and description */}
        <DescriptionBox>
          <Typography
            sx={{
              typography: sequel85.style.fontFamily,
              fontSize: '48px',
              fontWeight: 700,
            }}
          >
            Deposit weETH into Velodrome on Optimism and earn boosted APY
          </Typography>
          <Box
            marginTop={'32px'}
            sx={{
              display: 'flex',
              textAlign: 'left',
            }}
          >
            <Typography
              sx={{
                fontFamily: sora.style.fontFamily,
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '32px',
              }}
            >
              Velodrome Finance is a next-generation AMM that combines the best
              of Curve, Convex and Uniswap, designed to serve as the liquidity
              hub for the Superchain. Velodrome's flywheel allows protocols to
              build deep liquidity in a capital-efficient manner by directing
              $VELO emissions to their pools. Just deposit liquidity on
              Velodrome pools X and Y, earn boosted APY and officially enter the
              Superfest festival
            </Typography>
          </Box>
        </DescriptionBox>
        {/* Steps */}
        <DescriptionBox>
          <Box sx={{ display: 'flex', textAlign: 'left' }}>
            <Typography
              sx={{
                typography: sequel85.style.fontFamily,
                fontSize: '32px',
                fontWeight: 700,
              }}
            >
              Steps to complete the mission
            </Typography>
          </Box>
          <Box>
            <CustomRichBlocks
              id={1}
              baseUrl={baseUrl}
              content={attributes.Steps}
              activeTheme={'superfest'}
            />
          </Box>
        </DescriptionBox>
        {/* Additional Info */}
        <InformationBox>
          <InfoOutlinedIcon sx={{ width: 32, height: 32 }} />
          <Box sx={{ display: 'flex', textAlign: 'left', ml: '32px' }}>
            <Typography>
              {`You won’t have to come back for claiming, it will be done
            automatically in 24h and as long as you are in the pool for the OP
            rewards and the additional XP will be credited as PDAs on your
            profile page :)`}
            </Typography>
          </Box>
        </InformationBox>
        {/* Big Button */}
        <DescriptionBox>
          <MissionCTA
            title={'Deposit into Velodrome'}
            url={
              'https://feat-lf8678jumperimplementuith.jumper.exchange/across/'
            }
            id={1}
            key={generateKey('cta')}
          />
        </DescriptionBox>
      </Box>
    </SuperfestContainer>
  );
};
