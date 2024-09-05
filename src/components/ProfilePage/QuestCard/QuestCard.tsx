import DoneIcon from '@mui/icons-material/Done';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';
import {
  CenteredBox,
  CompletedTypography,
  NoSelectTypography,
} from '../ProfilePage.style';
import {
  CompletedBox,
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  QuestPlatformMainBox,
  XPDisplayBox,
} from './QuestCard.style';

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
  platformName,
  platformImage,
}: QuestCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Link
      href={link || '#'}
      target={'_blank'}
      style={{ textDecoration: 'inherit' }}
    >
      <QuestCardMainBox>
        {image && (
          <Image
            src={image}
            alt="Quest Card Image"
            width={240}
            height={240}
            style={{
              borderRadius: 8,
            }}
          />
        )}
        <QuestCardBottomBox>
          {active ? (
            <QuestPlatformMainBox platformName={platformName}>
              {platformName ? (
                <CenteredBox>
                  <CenteredBox
                    sx={{
                      marginRight: '4px',
                    }}
                  >
                    {platformImage && (
                      <Image
                        src={platformImage}
                        alt="Platform Image"
                        width={24}
                        height={24}
                        style={{
                          borderRadius: '100%',
                        }}
                      />
                    )}
                  </CenteredBox>
                  <NoSelectTypography
                    fontSize={'12px'}
                    lineHeight={'16px'}
                    fontWeight={700}
                  >
                    {platformName}
                  </NoSelectTypography>
                </CenteredBox>
              ) : null}
              {startDate && endDate
                ? //Todo: to keep when we'll have quests with timing again
                  // <QuestDatesBox>
                  //   <CenteredBox>
                  //     <DateRangeRoundedIcon sx={{ height: '16px' }} />
                  //   </CenteredBox>
                  //   <NoSelectTypography
                  //     fontSize={'12px'}
                  //     lineHeight={'16px'}
                  //     fontWeight={700}
                  //   >
                  //     {getStringDateFormatted(startDate, endDate)}
                  //   </NoSelectTypography>
                  // </QuestDatesBox>
                  undefined
                : null}
            </QuestPlatformMainBox>
          ) : (
            <CompletedBox>
              <DoneIcon sx={{ height: '16px', color: '#00B849' }} />
              <CompletedTypography
                fontSize="12px"
                lineHeight="16px"
                fontWeight={700}
              >
                {t('questCard.completed')}
              </CompletedTypography>
            </CompletedBox>
          )}
          <QuestCardTitleBox>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="24px"
              fontWeight={700}
            >
              {title}
            </NoSelectTypography>
          </QuestCardTitleBox>
          <QuestCardInfoBox points={points}>
            {points ? (
              <XPDisplayBox active={active}>
                <NoSelectTypography
                  fontWeight={700}
                  fontSize="14px"
                  lineHeight="18px"
                  color={
                    theme.palette.mode === 'light'
                      ? theme.palette.primary.main
                      : '#BEA0EB'
                  }
                >
                  {`+${points}`}
                </NoSelectTypography>
                <CenteredBox sx={{ marginLeft: '8px' }}>
                  <XPIcon size={24} />
                </CenteredBox>
              </XPDisplayBox>
            ) : null}
            {active && link ? (
              // <a
              //   href={link}
              //   target="_blank"
              //   style={{ textDecoration: 'none', width: '50%' }}
              //   rel="noreferrer"
              // >
              <Button
                aria-label={`Open ${t('questCard.join')}`}
                variant="secondary"
                size="medium"
                styles={{ alignItems: 'center', width: '100%' }}
              >
                <NoSelectTypography
                  fontSize="16px"
                  lineHeight="18px"
                  fontWeight={600}
                >
                  {t('questCard.join')}
                </NoSelectTypography>
              </Button>
            ) : // </a>
            null}
          </QuestCardInfoBox>
        </QuestCardBottomBox>
      </QuestCardMainBox>
    </Link>
  );
};
