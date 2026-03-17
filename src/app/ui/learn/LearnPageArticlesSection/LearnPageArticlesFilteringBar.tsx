import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { LearnPageArticlesFilteringBarContainer } from '../LearnArticlePage.style';
import { useLearnFiltering } from '../../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { useMemo } from 'react';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { TAG_ALL } from '@/providers/LearnProvider/filtering/types';
import { capitalizeString } from '@/utils/capitalizeString';
import dynamic from 'next/dynamic';

const HorizontalTabs = dynamic(
  () =>
    import('@/components/HorizontalTabs/HorizontalTabs').then(
      (mod) => mod.HorizontalTabs,
    ),
  {
    ssr: false,
  },
);
const Select = dynamic(
  () =>
    import('@/components/core/form/Select/Select').then((mod) => mod.Select),
  {
    ssr: false,
  },
);

export const LearnPageArticlesFilteringBar = () => {
  const { t } = useTranslation();
  const { tab, tabs, changeTab } = useLearnFiltering();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const tabOptions = useMemo(
    () => [
      {
        value: TAG_ALL,
        label: capitalizeString(TAG_ALL),
        'data-testid': `blog-articles-tab-${TAG_ALL}`,
      },
      ...[...(tabs ?? [])]?.sort().map((tabLabel) => ({
        value: tabLabel,
        label: tabLabel,
        'data-testid': `blog-articles-tab-${tabLabel}`,
      })),
    ],
    [tabs],
  );

  return (
    <LearnPageArticlesFilteringBarContainer>
      {isTablet ? (
        <Select
          options={tabOptions}
          value={tab ?? ''}
          onChange={changeTab}
          label={t('blog.views.viewBy')}
          variant={SelectVariant.Single}
          data-testid="blog-articles-filter-tab"
          menuPlacementX="right"
        />
      ) : (
        <HorizontalTabs
          tabs={tabOptions}
          value={tab ?? ''}
          onChange={(_, newValue) => changeTab(newValue)}
          size={HorizontalTabSize.MD}
          data-testid="blog-articles-tabs"
          sx={(theme) => ({
            width: 'fit-content',
            backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
          })}
        />
      )}
    </LearnPageArticlesFilteringBarContainer>
  );
};
