import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { TokenStack } from '../../TokenStack/TokenStack';
import {
  AssetOverviewCardSharedContentContainer,
  AssetOverviewCardNoContentCtaContainer,
  AssetOverviewCardSharedDescriptionContainer,
} from '../AssetOverviewCard.styles';
import Typography from '@mui/material/Typography';
import { AppPaths } from 'src/const/urls';
import { Button } from 'src/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { DEFAULT_NO_CONTENT_TOKENS } from '../constants';

export const AssetOverviewNoContent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleStartEarning = () => {
    router.push(AppPaths.Earn);
  };
  const handleStartSwapping = () => {
    router.push(AppPaths.Main);
  };
  return (
    <AssetOverviewCardSharedContentContainer>
      <TokenStack tokens={DEFAULT_NO_CONTENT_TOKENS} size={AvatarSize.XXL} />
      <AssetOverviewCardSharedDescriptionContainer>
        <Typography variant="bodyMediumStrong">
          {t('portfolio.assetOverviewCard.noContent.title')}
        </Typography>
        <Typography variant="bodySmallParagraph">
          {t('portfolio.assetOverviewCard.noContent.description')}
        </Typography>
      </AssetOverviewCardSharedDescriptionContainer>
      <AssetOverviewCardNoContentCtaContainer>
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
      </AssetOverviewCardNoContentCtaContainer>
    </AssetOverviewCardSharedContentContainer>
  );
};
