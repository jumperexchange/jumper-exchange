import type { FC } from 'react';
import { useMemo } from 'react';
import {
  ProtocolCardDescriptionContainer,
  ProtocolCardDescriptionSeeMoreButton,
} from '../ProtocolCard.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PROTOCOL_CARD_DESCRIPTION_MAX_CHARS } from '../constants';
import { useTranslation } from 'react-i18next';
import { RichBlocks } from '@/components/RichBlocks/RichBlocks';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { truncateRichText } from '@/components/RichBlocks/utils';

interface ProtocolCardDescriptionProps {
  richBlocksContent?: RootNode[];
  onSeeMoreClick: () => void;
}

export const ProtocolCardDescription: FC<ProtocolCardDescriptionProps> = ({
  richBlocksContent,
  onSeeMoreClick,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const maxChars = isMobile
    ? PROTOCOL_CARD_DESCRIPTION_MAX_CHARS.MOBILE
    : PROTOCOL_CARD_DESCRIPTION_MAX_CHARS.DESKTOP;

  const { content, isTruncated } = useMemo(() => {
    if (!richBlocksContent) {
      return { content: [], isTruncated: false };
    }
    return truncateRichText(richBlocksContent, maxChars);
  }, [richBlocksContent, maxChars]);

  return (
    <ProtocolCardDescriptionContainer>
      <RichBlocks
        content={content}
        blockSx={{
          paragraph: (theme) => ({
            ...theme.typography.bodyMediumParagraph,
            color: (theme.vars || theme).palette.text.secondary,
            overflowWrap: 'break-word',
            display: 'inline',
          }),
        }}
      />
      {isTruncated && (
        <>
          {` `}
          <ProtocolCardDescriptionSeeMoreButton
            variant="text"
            size="small"
            onClick={onSeeMoreClick}
            disableRipple
          >
            {t('earn.actions.seeMore')}
          </ProtocolCardDescriptionSeeMoreButton>
        </>
      )}
    </ProtocolCardDescriptionContainer>
  );
};
