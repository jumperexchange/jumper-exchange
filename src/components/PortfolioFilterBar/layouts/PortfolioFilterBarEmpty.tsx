'use client';

import type { FC } from 'react';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { PortfolioFilterBarContentContainer } from '../PortfolioFilterBar.styles';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';

export const PortfolioFilterBarEmpty: FC = () => {
  const { t } = useTranslation();

  return (
    <PortfolioFilterBarContentContainer>
      <PortfolioAnimatedLayoutContainer>
        <Button disabled size={Size.MD} variant={Variant.AlphaDark}>
          {t('portfolio.filter.filterSort')}
        </Button>
      </PortfolioAnimatedLayoutContainer>
    </PortfolioFilterBarContentContainer>
  );
};
