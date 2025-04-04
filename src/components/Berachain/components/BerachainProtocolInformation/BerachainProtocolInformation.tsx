import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import type { Theme } from '@mui/material';
import { Box, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { useMenuStore } from 'src/stores/menu';
import type { Quest } from 'src/types/loyaltyPass';
import { BerachainWidget } from '../BerachainWidget/BerachainWidget';
import {
  BerachainInformationProtocolCard,
  BerachainInformationProtocolIntro,
  BerachainInformationProtocolShare,
  BerachainInformationProtocolShareLink,
  BerachainProtocolActionBox,
  BerachainProtocolActionInfoBox,
} from './BerachainProtocolInformation.style';
import { BerachainProtocolFaqAccordionHeader } from './BerachainProtocolFaqAccordionHeader';
import type { EnrichedMarketDataType } from 'royco/queries';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import BerachainWidgetLoader from '../BerachainWidget/WidgetLoader/WidgetLoader';
import BackButton from '@/components/Berachain/components/BackButton';
import { getFullTitle } from '@/components/Berachain/utils';

interface BerachainProtocolActionProps {
  market?: EnrichedMarketDataType;
  card?: Quest;
  // detailInformation?: QuestDetails;
}

export const BerachainProtocolInformation = ({
  market,
  card,
}: BerachainProtocolActionProps) => {
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const detailInformation = card?.CustomInformation;

  const fullTitle = getFullTitle(market!, card);

  return (
    <BerachainProtocolActionBox>
      {isMobile &&
        (market ? (
          <BerachainWidget
            market={market}
            appName={card?.Title}
            fullAppName={fullTitle}
            appLink={
              detailInformation?.socials?.website ?? 'https://jumper.exchange/'
            }
          />
        ) : (
          <BerachainWidgetLoader />
        ))}
      <BerachainProtocolActionInfoBox>
        <BerachainInformationProtocolIntro>
          <BackButton />
          <BerachainInformationProtocolCard>
            <Stack spacing={2} direction="row">
              {!isMobile &&
                (card?.Image?.url ? (
                  <Image
                    src={`${baseUrl}${card.Image.url}`}
                    alt="Protocol image"
                    width={card.Image.width}
                    height={card.Image.height}
                    style={{
                      width: 144,
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Skeleton
                    variant="circular"
                    sx={{
                      width: '144px',
                      height: '144px',
                      flexShrink: 0,
                      marginTop: '16px',
                    }}
                  />
                ))}
              <Stack spacing={2} direction="column">
                {card?.Title ? (
                  <Typography variant="titleSmall">{fullTitle}</Typography>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: '32px', width: '380px' }}
                  />
                )}
                {card?.Description ? (
                  <Typography variant="bodyMedium" color="textSecondary">
                    {market?.description}
                  </Typography>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: '72px', width: '100%', borderRadius: '8px' }}
                  />
                )}

                <Box sx={{ display: 'flex', gap: '12px' }}>
                  {detailInformation?.socials && (
                    <>
                      {detailInformation?.socials?.twitter && (
                        <BerachainInformationProtocolShareLink
                          href={detailInformation?.socials?.twitter}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          <BerachainInformationProtocolShare>
                            <XIcon sx={{ width: '16px', height: '16px' }} />
                          </BerachainInformationProtocolShare>
                        </BerachainInformationProtocolShareLink>
                      )}
                      {detailInformation?.socials?.telegram && (
                        <BerachainInformationProtocolShareLink
                          href={detailInformation?.socials?.telegram}
                        >
                          <BerachainInformationProtocolShare>
                            <TelegramIcon
                              sx={{ width: '16px', height: '16px' }}
                            />
                          </BerachainInformationProtocolShare>
                        </BerachainInformationProtocolShareLink>
                      )}
                      {detailInformation?.socials?.website && (
                        <BerachainInformationProtocolShareLink
                          href={detailInformation?.socials?.website}
                        >
                          <BerachainInformationProtocolShare>
                            <LanguageIcon
                              sx={{ width: '16px', height: '16px' }}
                            />
                          </BerachainInformationProtocolShare>
                        </BerachainInformationProtocolShareLink>
                      )}
                    </>
                  )}
                </Box>
              </Stack>
            </Stack>
          </BerachainInformationProtocolCard>
        </BerachainInformationProtocolIntro>
        {card?.CustomInformation ? (
          detailInformation?.faqItems && (
            <BerachainInformationProtocolCard sx={{ padding: '20px 12px' }}>
              <AccordionFAQ
                showIndex={true}
                showDivider={true}
                showAnswerDivider={true}
                sx={{ padding: 0 }}
                itemSx={{
                  padding: '0px 8px',
                  backgroundColor: 'transparent',
                  '.MuiAccordionSummary-root': {
                    padding: 0,
                  },
                  '.accordion-items': {
                    gap: '4px',
                  },
                  '.MuiAccordionDetails-root': {
                    padding: '20px 16px 16px',
                  },
                }}
                content={detailInformation?.faqItems}
                accordionHeader={<BerachainProtocolFaqAccordionHeader />}
                questionTextTypography="bodyLarge"
                answerTextTypography="bodyMedium"
                arrowSize={12}
              />
            </BerachainInformationProtocolCard>
          )
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ height: '312px', width: '100%', borderRadius: '8px' }}
          />
        )}
        {card?.Information && (
          <BerachainInformationProtocolCard
            sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}
          >
            <InfoIcon />
            <Typography variant="bodySmall">{card?.Information}</Typography>
          </BerachainInformationProtocolCard>
        )}
      </BerachainProtocolActionInfoBox>
      {!isMobile &&
        (market ? (
          <BerachainWidget
            fullAppName={fullTitle}
            market={market}
            appName={card?.Title}
            appLink={
              detailInformation?.socials?.website ?? 'https://jumper.exchange/'
            }
          />
        ) : (
          <BerachainWidgetLoader />
        ))}
    </BerachainProtocolActionBox>
  );
};
