import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStack } from '../../EntityStack/EntityStack';
import { Button } from '@/components/Button/Button';
import { AppPaths } from '@/const/urls';
import {
  NoContentContainer,
  SharedDescriptionContainer,
  NoContentCtaContainer,
} from '../AssetOverviewCard.styles';
import { DEFAULT_NO_CONTENT_TOKENS } from '../constants';

export const NoContentView: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleStartEarning = () => {
    router.push(AppPaths.Earn);
  };

  const handleStartSwapping = () => {
    router.push(AppPaths.Main);
  };

  return (
    <NoContentContainer>
      <EntityStack entities={DEFAULT_NO_CONTENT_TOKENS} size={AvatarSize.XXL} />
      <SharedDescriptionContainer>
        <Typography variant="bodyMediumStrong">
          {t('portfolio.assetOverviewCard.noContent.title')}
        </Typography>
        <Typography variant="bodySmallParagraph">
          {t('portfolio.assetOverviewCard.noContent.description')}
        </Typography>
      </SharedDescriptionContainer>
      <NoContentCtaContainer>
        <Button
          variant="primary"
          styles={(theme) => ({
            ...theme.typography.bodySmallStrong,
            height: 'auto',
            padding: `${theme.spacing(1.375, 2)} !important`,
          })}
          onClick={handleStartEarning}
        >
          {t('portfolio.assetOverviewCard.noContent.cta.startEarning')}
        </Button>
        <Button
          variant="secondary"
          styles={(theme) => ({
            ...theme.typography.bodySmallStrong,
            height: 'auto',
            padding: `${theme.spacing(1.375, 2)} !important`,
          })}
          onClick={handleStartSwapping}
        >
          {t('portfolio.assetOverviewCard.noContent.cta.startSwapping')}
        </Button>
      </NoContentCtaContainer>
    </NoContentContainer>
  );
};
