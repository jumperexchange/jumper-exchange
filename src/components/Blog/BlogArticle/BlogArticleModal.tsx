import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { ExternalLink } from '@/components/Link/ExternalLink';
import { useBlogArticleStore } from '@/stores/learn/BlogArticleStore';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const BlogArticleModal = () => {
  const [isModalOpen, modalContent, closeModal] = useBlogArticleStore((s) => [
    s.isModalOpen,
    s.modalContent,
    s.closeModal,
  ]);

  const handleClick = () => {
    // @Note: add tracking here
    closeModal();
  };

  return (
    isModalOpen &&
    modalContent && (
      <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
        <SectionCardContainer
          sx={(theme) => ({
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
            <Stack spacing={0.5}>
              {modalContent.title && (
                <Typography variant="titleSmall">
                  {modalContent.title}
                </Typography>
              )}
              <Typography variant="bodyMediumParagraph">
                {modalContent.description}
              </Typography>
            </Stack>
            <Button
              variant={Variant.Primary}
              fullWidth
              href={modalContent.ctaLink}
              component={modalContent.ctaLink ? ExternalLink : undefined}
              onClick={handleClick}
            >
              {modalContent.cta ?? 'Close'}
            </Button>
          </Stack>
        </SectionCardContainer>
      </ModalContainer>
    )
  );
};
