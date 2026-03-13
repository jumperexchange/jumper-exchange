import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ModalContent {
  title?: string;
  description: string;
  cta?: string;
  ctaLink?: string;
}

interface BlogArticleState {
  modalContent?: ModalContent;
  modalShownForArticlesIds: string[];
  isModalOpen: boolean;
  shouldOpenModalForArticle: (articleId: string) => boolean;
  openModal: (articleId: string, modalContent: ModalContent) => void;
  closeModal: () => void;
}

export const useBlogArticleStore = createWithEqualityFn(
  persist<BlogArticleState>(
    (set, get) => ({
      modalContent: undefined,
      isModalOpen: false,
      modalShownForArticlesIds: [],

      shouldOpenModalForArticle: (articleId: string) => {
        const modalShownForArticlesIds = get().modalShownForArticlesIds ?? [];
        return !modalShownForArticlesIds.includes(articleId);
      },

      openModal: (articleId: string, modalContent: ModalContent) => {
        set({
          isModalOpen: true,
          modalContent,
          modalShownForArticlesIds: [
            ...(get().modalShownForArticlesIds ?? []),
            articleId,
          ],
        });
      },

      closeModal: () => {
        set({
          isModalOpen: false,
          modalContent: undefined,
        });
      },
    }),
    {
      name: 'blog-article-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({
          modalShownForArticlesIds: state.modalShownForArticlesIds,
        }) as unknown as BlogArticleState,
    },
  ),
  shallow,
);
