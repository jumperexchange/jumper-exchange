import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { getSiteUrl } from 'src/const/urls';
import { useMenuStore } from 'src/stores/menu';
import type { BerachainProtocolSocials } from '../../const/berachainExampleData';
import { useBerachainFaq } from '../../hooks/useBerachainFaq';
import { BerachainWidget } from '../BerachainWidget/BerachainWidget';
import {
  BerachainActionProtocolCard,
  BerachainActionProtocolIntro,
  BerachainActionProtocolShare,
  BerachainActionProtocolShareLink,
  BerachainProtocolActionBox,
  BerachainProtocolActionInfoBox,
} from './BerachainProtocolAction.style';
import { BerachainProtocolFaqAccordionHeader } from './BerachainProtocolFaqAccordionHeader';

interface BerachainProtocolActionProps {
  image?: string;
  socials?: BerachainProtocolSocials;
  slug?: string;
  title?: string;
  description?: string;
}

export const BerachainProtocolAction = ({
  image,
  socials,
  slug,
  title,
  description,
}: BerachainProtocolActionProps) => {
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();

  const faqItems = useBerachainFaq();

  const handleCopyButton = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return (
    <BerachainProtocolActionBox>
      <BerachainProtocolActionInfoBox>
        <BerachainActionProtocolIntro>
          {image ? (
            <Image src={image} alt="Protocol image" width={192} height={192} />
          ) : (
            <Skeleton
              variant="circular"
              sx={{ width: '192px', height: '192px', flexShrink: 0 }}
            />
          )}
          <BerachainActionProtocolCard>
            {title ? (
              <Typography variant="titleSmall">What is {title}?</Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '32px', width: '160px' }}
              />
            )}
            {description ? (
              <Typography variant="bodyMedium">{description}</Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '72px', width: '100%' }}
              />
            )}
            <Box sx={{ display: 'flex', gap: '12px' }}>
              {socials && (
                <>
                  {socials?.twitter && (
                    <BerachainActionProtocolShareLink
                      href={socials.twitter}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <BerachainActionProtocolShare>
                        <XIcon />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                  {socials?.telegram && (
                    <BerachainActionProtocolShareLink href={socials.telegram}>
                      <BerachainActionProtocolShare>
                        <TelegramIcon />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                  {socials?.website && (
                    <BerachainActionProtocolShareLink href={socials.website}>
                      <BerachainActionProtocolShare>
                        <LanguageIcon />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                </>
              )}
              <BerachainActionProtocolShare
                onClick={() =>
                  handleCopyButton(`${getSiteUrl()}/berachain/explore/${slug}`)
                }
              >
                <ContentCopyIcon />
              </BerachainActionProtocolShare>
            </Box>
          </BerachainActionProtocolCard>
        </BerachainActionProtocolIntro>
        <BerachainActionProtocolCard>
          <AccordionFAQ
            showIndex={true}
            sx={{ padding: '20px' }}
            content={faqItems}
            accordionHeader={<BerachainProtocolFaqAccordionHeader />}
            questionTextTypography="bodyLarge"
            answerTextTypography="bodyMedium"
            arrowSize={20}
          />
        </BerachainActionProtocolCard>
        <BerachainActionProtocolCard
          sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}
        >
          <InfoIcon />
          <Typography variant="bodySmall">
            Rewards starts accruing as soon as you do the onchain actions
            (supply, borrow etc.). You can claim your first rewards in
            approximately 24h. The additional XP will be credited as PDAs on
            your profile page at the end of the campaign.
          </Typography>
        </BerachainActionProtocolCard>
      </BerachainProtocolActionInfoBox>
      <BerachainWidget />
    </BerachainProtocolActionBox>
  );
};
