import { NewsletterSubscribeForm } from '@/app/ui/newsletter/NewsletterSubscribeForm';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { ExternalLink } from '@/components/Link/ExternalLink';
import { useBlogArticleTracking } from '@/hooks/userTracking/useBlogArticleTracking';
import { useBlogArticleStore } from '@/stores/learn/BlogArticleStore';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface BlogArticleModalProps {
  articleId: number;
  articleTitle: string;
}

export const BlogArticleModal: FC<BlogArticleModalProps> = ({
  articleId,
  articleTitle,
}) => {
  const { t } = useTranslation();
  const { trackBlogArticleClosePopupEvent } = useBlogArticleTracking();
  const [isModalOpen, modalContent, closeModal] = useBlogArticleStore((s) => [
    s.isModalOpen,
    s.modalContent,
    s.closeModal,
  ]);

  const handleClick = () => {
    trackBlogArticleClosePopupEvent(
      articleId,
      articleTitle,
      modalContent?.title,
    );

    closeModal();
  };

  return (
    isModalOpen &&
    modalContent && (
      <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
        <SectionCardContainer
          sx={(theme) => ({
            position: 'relative',
            maxHeight: 'calc(100vh - 6rem)',
            minWidth: '100%',
            maxWidth: 400,
            borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
            [theme.breakpoints.up('sm')]: {
              minWidth: 400,
            },
          })}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              {modalContent.title && (
                <Typography variant="urbanistTitleMedium">
                  {modalContent.title}
                </Typography>
              )}
              <Typography variant="bodyMediumParagraph">
                {modalContent.description}
              </Typography>
            </Stack>
            {modalContent.isNewsletterSubscription ? (
              <NewsletterSubscribeForm utmCampaign="blog-article" />
            ) : (
              <Button
                variant={Variant.Primary}
                fullWidth
                href={modalContent.ctaLink}
                component={modalContent.ctaLink ? ExternalLink : undefined}
                onClick={handleClick}
              >
                {modalContent.cta ?? t('buttons.close')}
              </Button>
            )}
          </Stack>
        </SectionCardContainer>
      </ModalContainer>
    )
  );
};
