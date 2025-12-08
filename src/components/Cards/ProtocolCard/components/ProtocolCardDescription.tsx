import type { FC } from 'react';
import { useMemo } from 'react';
import {
  ProtocolCardDescriptionContainer,
  ProtocolCardDescriptionSeeMoreButton,
} from '../ProtocolCard.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PROTOCOL_CARD_DESCRIPTION_MAX_CHARS } from '../constants';
import { stringLenShortener } from '@/utils/stringLenShortener';
import { useTranslation } from 'react-i18next';

interface ProtocolCardDescriptionProps {
  text?: string;
  onSeeMoreClick: () => void;
}

export const ProtocolCardDescription: FC<ProtocolCardDescriptionProps> = ({
  text,
  onSeeMoreClick,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const maxChars = isMobile
    ? PROTOCOL_CARD_DESCRIPTION_MAX_CHARS.MOBILE
    : PROTOCOL_CARD_DESCRIPTION_MAX_CHARS.DESKTOP;

  const { shortenedText, isTruncated } = useMemo(() => {
    if (!text) {
      return { shortenedText: '', isTruncated: false };
    }
    return {
      shortenedText: stringLenShortener(text, maxChars),
      isTruncated: text.length > maxChars,
    };
  }, [text, maxChars]);

  return (
    <ProtocolCardDescriptionContainer variant="bodyMediumParagraph">
      {shortenedText}
      {` `}
      {isTruncated && (
        <ProtocolCardDescriptionSeeMoreButton
          variant="text"
          size="small"
          onClick={onSeeMoreClick}
          disableRipple
        >
          {t('earn.actions.seeMore')}
        </ProtocolCardDescriptionSeeMoreButton>
      )}
    </ProtocolCardDescriptionContainer>
  );
};
