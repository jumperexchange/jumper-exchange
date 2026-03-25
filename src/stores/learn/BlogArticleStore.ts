import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import superjson from 'superjson';

const getLocalStorage = () =>
  typeof window === 'undefined' ? undefined : localStorage;

interface ModalContent {
  title?: string;
  description: string;
  cta?: string;
  ctaLink?: string;
  isNewsletterSubscription: boolean;
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
        const currentIds = get().modalShownForArticlesIds ?? [];
        set({
          isModalOpen: true,
          modalContent,
          modalShownForArticlesIds: currentIds.includes(articleId)
            ? currentIds
            : [...currentIds, articleId],
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
      name: 'blog-article-store',
      storage: {
        getItem: (name) => {
          const str = getLocalStorage()?.getItem(name);
          if (!str) {
            return null;
          }
          try {
            return superjson.parse(str);
          } catch {
            getLocalStorage()?.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          getLocalStorage()?.setItem(name, superjson.stringify(value));
        },
        removeItem: (name) => {
          getLocalStorage()?.removeItem(name);
        },
      },
      partialize: (state) =>
        ({
          modalShownForArticlesIds: state.modalShownForArticlesIds,
        }) as unknown as BlogArticleState,
    },
  ),
  shallow,
);
