import { useAccounts } from '@/hooks/useAccounts';
import { Box, Breakpoint, Stack, Typography, useTheme } from '@mui/material';
import { Button, ButtonSecondary } from 'src/components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sequel85, sora } from 'src/fonts/fonts';
import { CustomRichBlocks } from 'src/components/Blog';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import Image from 'next/image';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import { SuperfestXPIcon } from 'src/components/illustrations/XPIcon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import generateKey from 'src/app/lib/generateKey';
import { useRouter } from 'next/navigation';
import { JUMPER_FEST } from 'src/const/urls';
import { Quest } from 'src/types/loyaltyPass';
import {
  BannerImageBox,
  DateChainBox,
  SupportedChainsBox,
  BannerBottomBox,
  BannerMainBox,
  QuestDatesBox,
  BannerTitleBox,
} from './Banner.style';
import {
  FlexCenterRowBox,
  FlexCenterSpaceRowBox,
} from '../SuperfestMissionPage.style';
import { CenteredBox } from '../../Superfest.style';
import { RewardBox } from './Rewards/RewardBox';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
}

interface Chain {
  logo: string;
  name: string;
}

export const BannerBox = ({ quest, baseUrl }: SuperfestMissionPageVar) => {
  const attributes = quest?.attributes;
  const rewards = attributes.CustomInformation['rewards'];
  const chains = attributes.CustomInformation['chains'];
  const partner = attributes.CustomInformation['partner'];

  return (
    <BannerMainBox>
      <BannerImageBox>
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
      </BannerImageBox>
      <BannerBottomBox>
        {/* date + chains */}
        <DateChainBox>
          <QuestDatesBox>
            <CenteredBox>
              <DateRangeRoundedIcon sx={{ height: '16px' }} />
            </CenteredBox>
            <ProfilePageTypography fontSize={'12px'} lineHeight={'16px'}>
              July-Aug
              {/* {getStringDateFormatted(startDate, endDate)} */}
            </ProfilePageTypography>
          </QuestDatesBox>
          <FlexCenterRowBox>
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
            <SupportedChainsBox>
              {chains.map((elem: Chain, i: number) => {
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
            </SupportedChainsBox>
          </FlexCenterRowBox>
        </DateChainBox>
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
        <FlexCenterSpaceRowBox mt="16px">
          {/* rewards  */}
          <RewardBox
            logo={rewards.logo}
            title={'Rewards'}
            value={`${rewards.amount} ${rewards.name}`}
          />
          {/* Points  */}

          <RewardBox
            logo={'https://strapi.li.finance/uploads/xp_cfcff186e5.png'}
            title={'Points'}
            value={String(attributes.Points)}
          />
          {/* partner  */}
          <RewardBox
            logo={partner.logo}
            title={'Supported by'}
            value={partner.name}
          />
        </FlexCenterSpaceRowBox>
      </BannerBottomBox>
    </BannerMainBox>
  );
};
