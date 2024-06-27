import { useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button';
import { SuperfestXPIcon } from '../../illustrations/XPIcon';
import {
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  XPDisplayBox,
} from './QuestCard.style';
import {
  CenteredBox,
  FlexSpaceBetweenBox,
  Sequel85Typography,
  SoraTypography,
} from '../Superfest.style';
import { useRouter } from 'next/navigation';
import { FlexCenterRowBox } from '../SuperfestPage/SuperfestMissionPage.style';
import { Chain } from '../SuperfestPage/Banner/Banner';

interface QuestCardProps {
  active?: boolean;
  title?: string;
  image?: string;
  points?: number;
  link?: string;
  startDate?: string;
  endDate?: string;
  platformName?: string;
  platformImage?: string;
  slug?: string;
  chains?: Chain[];
}

export const QuestCard = ({
  active,
  title,
  image,
  points,
  link,
  startDate,
  endDate,
  slug,
  chains,
}: QuestCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <QuestCardMainBox>
      {image && (
        <Image
          src={image}
          alt="Quest Card Image"
          width={256}
          height={256}
          style={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
      )}
      <QuestCardBottomBox>
        <QuestCardTitleBox>
          <Sequel85Typography fontSize="18px" lineHeight="24px">
            {title}
          </Sequel85Typography>
        </QuestCardTitleBox>

        <FlexSpaceBetweenBox marginBottom={'8px'}>
          <FlexCenterRowBox>
            {chains?.map((elem: Chain, i: number) => {
              return (
                <Image
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
          </FlexCenterRowBox>
          <FlexCenterRowBox>
            <XPDisplayBox active={active}>
              <Sequel85Typography
                fontSize="14px"
                lineHeight="18px"
                color={'#ffffff'}
              >
                {`+${points}`}
              </Sequel85Typography>
              <CenteredBox sx={{ marginLeft: '4px' }}>
                <SuperfestXPIcon size={16} />
              </CenteredBox>
            </XPDisplayBox>
          </FlexCenterRowBox>
        </FlexSpaceBetweenBox>
        <QuestCardInfoBox points={points}>
          {active && slug ? (
            <Button
              disabled={false}
              variant="secondary"
              size="medium"
              styles={{
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent',
                border: '2px dotted',
                padding: '16px',
                '&:hover': {
                  color: '#FFFFFF',
                  backgroundColor: '#ff0420',
                },
              }}
              onClick={() => router.push(slug)}
            >
              <SoraTypography
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                {String(t('questCard.join')).toUpperCase()}
              </SoraTypography>
            </Button>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};
