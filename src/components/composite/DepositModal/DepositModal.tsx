import { FC, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { TaskType } from 'src/types/strapi';
import {
  ModalContainer,
  ModalContainerProps,
} from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useReadContracts } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { Hex } from 'viem';
import { useZapEarnOpportunitySlugStorage } from 'src/providers/hooks';
interface DepositModalProps extends ModalContainerProps {
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url' | 'lpToken' | 'latest' | 'slug'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  };
}

export const DepositModal: FC<DepositModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  useZapEarnOpportunitySlugStorage(earnOpportunity.slug);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  const { account } = useAccount();

  const contractsConfig = useMemo(() => {
    return [
      {
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: projectData.address as Hex,
        chainId: projectData.chainId,
        functionName: 'balanceOf',
        args: [account.address as Hex],
      },
    ];
  }, [projectData.address, projectData.chainId, account.address]);

  const { refetch: refetchDepositToken } = useReadContracts({
    contracts: contractsConfig,
    query: {
      enabled: !!account.address,
    },
  });

  return (
    <WidgetTrackingProvider>
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <ClientOnly>
          <ZapDepositBackendWidget
            ctx={{
              theme: {
                container: {
                  maxHeight: 'calc(100vh - 6rem)',
                  minWidth: '100%',
                  maxWidth: 400,
                  borderRadius: '24px',
                },
              },
              taskType: TaskType.Zap,
              overrideHeader: 'Quick deposit',
            }}
            customInformation={{ projectData }}
            zapData={zapData}
            isZapDataSuccess={true}
            refetchDepositToken={refetchDepositToken}
          />
        </ClientOnly>
      </ModalContainer>
    </WidgetTrackingProvider>
  );
};
