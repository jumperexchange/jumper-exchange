import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { FC, useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Trans, useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Button } from 'src/components/Button';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { StatusBottomSheet } from 'src/components/composite/StatusBottomSheet/StatusBottomSheet';
import { SignMessageErrorType, useSignMessage } from 'src/hooks/useSignMessage';
import { useVerifyTaskWithSharedState } from 'src/hooks/tasksVerification/useVerifyTaskWithSharedState';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { walletDigest } from 'src/utils/walletDigest';
import { useVerifyWalletStatusSheetContent } from '../hooks';
import {
  VERIFY_WALLET_CONTAINER_ID,
  VERIFY_WALLET_MESSAGE,
} from '../constants';
import {
  MissionFooterContainer,
  MissionWidgetContainer,
  MissionWidgetContentContainer,
  MissionWidgetDescription,
  MissionWidgetTitle,
} from './MissionWidget.styles';
import { Link } from 'src/components/Link';
import { DISCORD_URL } from 'src/const/urls';
import { ParseKeys } from 'i18next';

interface MissionVerifyWalletProps {
  isComplete: boolean;
}

export const MissionVerifyWallet: FC<MissionVerifyWalletProps> = ({
  isComplete,
}) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { openWalletMenu } = useWalletMenu();
  const { taskTitle, missionId, currentActiveTaskId, currentActiveTaskName } =
    useMissionStore();

  const [errorType, setErrorType] = useState<SignMessageErrorType>(
    SignMessageErrorType.Unknown,
  );
  const [showError, setShowError] = useState(false);
  const [statusBottomSheetHeight, setStatusBottomSheetHeight] = useState(0);

  const {
    signMessageAsync,
    isError: isSignMessageError,
    errorType: signErrorType,
  } = useSignMessage();
  const { handleVerifyTask, isError: isVerifyTaskError } =
    useVerifyTaskWithSharedState(
      missionId!,
      currentActiveTaskId!,
      currentActiveTaskName,
    );

  const isConnected = !!account.address;

  useEffect(() => {
    if (isSignMessageError) {
      setErrorType(signErrorType);
      setShowError(true);
    }
  }, [isSignMessageError, signErrorType]);

  useEffect(() => {
    if (isVerifyTaskError) {
      setErrorType(SignMessageErrorType.Unknown);
      setShowError(true);
    }
  }, [isVerifyTaskError]);

  const title = taskTitle ?? t('missions.tasks.verifyWallet.title');

  const handleCloseErrorBottomSheet = () => {
    setShowError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleCloseErrorBottomSheet();

    if (!isConnected) {
      openWalletMenu();
      return;
    }

    if (account?.address && account?.chainType) {
      const signature = await signMessageAsync({
        message: VERIFY_WALLET_MESSAGE,
        walletAddress: account.address,
        walletType: account.chainType,
      });

      handleVerifyTask({
        signature,
        message: VERIFY_WALLET_MESSAGE,
        walletType: account?.chainType,
      });
    }
  };

  const errorSheetProps = useVerifyWalletStatusSheetContent(errorType, () =>
    setShowError(false),
  );

  const getTranslationWithDiscordLink = (key: ParseKeys<'translation'>) => {
    return (
      <Trans<ParseKeys<'translation'>>
        i18nKey={key}
        components={[
          <Link
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 'bold' }}
          />,
        ]}
      />
    );
  };

  const renderContent = () => {
    if (!isConnected) {
      return (
        <>
          <MissionWidgetContentContainer>
            <MissionWidgetTitle variant="titleSmall">
              {title}
            </MissionWidgetTitle>
            <MissionWidgetDescription variant="bodyMedium">
              {getTranslationWithDiscordLink(
                'missions.tasks.verifyWallet.description.notConnected',
              )}
            </MissionWidgetDescription>
          </MissionWidgetContentContainer>

          <Button type="submit">
            {t('missions.tasks.verifyWallet.action.connectAndVerify')}
          </Button>
        </>
      );
    }

    if (isComplete) {
      return (
        <>
          <MissionWidgetContentContainer>
            <MissionWidgetTitle variant="titleSmall">
              {title}
            </MissionWidgetTitle>
            <MissionWidgetDescription variant="bodyMedium">
              {t('missions.tasks.verifyWallet.description.verified')}
            </MissionWidgetDescription>
          </MissionWidgetContentContainer>

          <Badge
            variant={BadgeVariant.Success}
            size={BadgeSize.XL}
            endIcon={<CheckIcon />}
            label={walletDigest(account.address)}
            sx={{ width: '100%' }}
          />
        </>
      );
    }

    return (
      <>
        <MissionWidgetContentContainer>
          <MissionWidgetTitle variant="titleSmall">{title}</MissionWidgetTitle>
          <MissionWidgetDescription variant="bodyMedium">
            {getTranslationWithDiscordLink(
              'missions.tasks.verifyWallet.description.notVerified',
            )}
          </MissionWidgetDescription>
        </MissionWidgetContentContainer>

        <MissionFooterContainer>
          <Badge
            variant={BadgeVariant.Alpha}
            size={BadgeSize.XL}
            label={walletDigest(account.address)}
            sx={{ width: '100%' }}
          />

          <Button type="submit">
            {t('missions.tasks.verifyWallet.action.verifyWallet')}
          </Button>
        </MissionFooterContainer>
      </>
    );
  };

  return (
    <SectionCardContainer
      as="form"
      onSubmit={handleSubmit}
      id={VERIFY_WALLET_CONTAINER_ID}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        minHeight: showError ? statusBottomSheetHeight + 24 : 'auto',
      }}
    >
      <MissionWidgetContainer
        sx={{ height: 'auto', justifyContent: 'space-between' }}
      >
        {renderContent()}

        <StatusBottomSheet
          {...errorSheetProps}
          containerId={VERIFY_WALLET_CONTAINER_ID}
          isOpen={showError}
          onClose={handleCloseErrorBottomSheet}
          onHeightChange={setStatusBottomSheetHeight}
        />
      </MissionWidgetContainer>
    </SectionCardContainer>
  );
};
