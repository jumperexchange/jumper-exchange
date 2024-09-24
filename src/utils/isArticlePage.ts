import { JUMPER_LEARN_PATH } from '@/const/urls';

export function isArticlePage(url: string) {
  // Split the URL into its components
  const urlComponents = new URL(url);
  // Check if the pathname contains '/learn' and has a slug following it
  const pathname = urlComponents.pathname;
  const isArticle =
    pathname.includes(JUMPER_LEARN_PATH) &&
    !!pathname.split(JUMPER_LEARN_PATH)[1];
  return isArticle;
}
