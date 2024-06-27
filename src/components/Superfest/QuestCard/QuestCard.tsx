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
}

function getStringDateFormatted(startDate: string, endDate: string): string {
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const startMonth = sDate.toLocaleString('default', { month: 'short' });
  const endMonth = eDate.toLocaleString('default', { month: 'short' });
  return `${startMonth} ${sDate.getDate()} - ${startMonth === endMonth ? '' : endMonth} ${eDate.getDate()}`;
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
