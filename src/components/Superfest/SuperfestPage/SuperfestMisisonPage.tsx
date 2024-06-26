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
import { useRouter } from 'next/navigation';
import { JUMPER_FEST } from 'src/const/urls';
import { Quest } from 'src/types/loyaltyPass';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
}

export const SuperfestMissionPage = ({
  quest,
  baseUrl,
}: SuperfestMissionPageVar) => {
  const theme = useTheme();
  const router = useRouter();

  const attributes = quest?.attributes;
  const rewards = attributes.CustomInformation['rewards'];
  const chains = attributes.CustomInformation['chains'];
  const partner = attributes.CustomInformation['partner'];

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
              router.push(JUMPER_FEST);
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
          <Box sx={{ position: 'relative', width: '100%', height: '60%' }}>
            <Image
              src={`${new URL(
                attributes.BannerImage?.data[0]?.attributes?.url,
                baseUrl,
              )}`}
              fill
              alt="Banner Image"
              style={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }}
            />
          </Box>
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
                <Typography
                  sx={{
                    fontSize: '16px',
                    typography: sora.style.fontFamily,
                    fontWeight: 500,
                    lineHeight: '20px',
                  }}
                >
                  Supported chains
                </Typography>
                <Box
                  sx={{
                    ml: '8px',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {chains.map((elem, i) => {
                    return (
                      <Image
                        key={`chain-logo-${i}`}
                        src={elem.logo}
                        style={{
                          marginLeft: i === 0 ? '' : '-8px',
                          zIndex: 100 - i,
                        }}
                        alt={elem.name}
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
                {attributes.Title}
              </Typography>
            </BannerTitleBox>
            {/* rewards  */}
            <Box
              sx={{
                mt: '16px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              {/* rewards  */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Image
                  src={rewards.logo}
                  style={{}}
                  alt="base"
                  width="48"
                  height="48"
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    alignContent: 'center',
                    ml: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      typography: sora.style.fontFamily,
                      fontWeight: 700,
                      color: '#525252',
                    }}
                  >
                    Rewards
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      typography: sora.style.fontFamily,
                      fontWeight: 800,
                    }}
                  >{`${rewards.amount} ${rewards.name}`}</Typography>
                </Box>
              </Box>
              {/* Points  */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Image
                  src="https://strapi.li.finance/uploads/xp_cfcff186e5.png"
                  style={{}}
                  alt="base"
                  width="48"
                  height="48"
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    alignContent: 'center',
                    ml: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      typography: sora.style.fontFamily,
                      fontWeight: 700,
                      color: '#525252',
                    }}
                  >
                    Points
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      typography: sora.style.fontFamily,
                      fontWeight: 800,
                    }}
                  >
                    {attributes.Points}
                  </Typography>
                </Box>
              </Box>
              {/* partner  */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Image
                  src={partner.logo}
                  style={{ borderRadius: '64px' }}
                  alt="base"
                  width="48"
                  height="48"
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    alignContent: 'center',
                    ml: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      typography: sora.style.fontFamily,
                      fontWeight: 700,
                      color: '#525252',
                    }}
                  >
                    Sponsored by
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      typography: sora.style.fontFamily,
                      fontWeight: 800,
                    }}
                  >
                    {partner.name}
                  </Typography>
                </Box>
              </Box>
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
            {attributes.Subtitle}
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
              {attributes.Description}
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
            <Typography>{attributes.Information}</Typography>
          </Box>
        </InformationBox>
        {/* Big Button */}
        <DescriptionBox>
          <MissionCTA
            title={attributes.Title}
            url={attributes.Link}
            id={1}
            key={generateKey('cta')}
          />
        </DescriptionBox>
      </Box>
    </SuperfestContainer>
  );
};
