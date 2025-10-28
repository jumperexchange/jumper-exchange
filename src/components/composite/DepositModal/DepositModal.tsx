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
import { CenteredWrapper, CloseIconButton } from './DepositModal.styles';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useReadContracts } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { Hex } from 'viem';

interface DepositModalProps {
  onClose: () => void;
  isOpen: boolean;
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url' | 'lpToken' | 'latest'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  };
}

const motionConfig = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    visualDuration: 0.5,
    delay: 0.1,
  },
  style: {
    position: 'absolute',
    top: '0',
    right: '0',
    x: '100%',
    y: '-100%',
  },
} as const;

export const DepositModal: FC<DepositModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);
  console.log('customInformation', { projectData, zapData }, earnOpportunity);

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
      <Modal open={isOpen} onClose={onClose}>
        <CenteredWrapper>
          {!isMobile && (
            <motion.div {...motionConfig}>
              <CloseIconButton onClick={onClose}>
                <CloseIcon
                  sx={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </CloseIconButton>
            </motion.div>
          )}
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
        </CenteredWrapper>
      </Modal>
    </WidgetTrackingProvider>
  );
};
