import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FC, useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { ZapInitProvider } from 'src/providers/ZapInitProvider/ZapInitProvider';
import CloseIcon from '@mui/icons-material/Close';
import { CenteredWrapper, CloseIconButton } from './DepositModal.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TaskType } from 'src/types/strapi';
import { motion } from 'framer-motion';
import { EarnOpportunity } from 'src/types/jumper-backend';

interface DepositModalProps {
  onClose: () => void;
  isOpen: boolean;
  earnOpportunity: Pick<
    EarnOpportunity,
    'name' | 'asset' | 'protocol' | 'url'
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
  const customInformation = useMemo(() => {
    return {
      projectData: {
        chain: earnOpportunity.asset.chain.chainKey,
        chainId: earnOpportunity.asset.chain.chainId,
        address: earnOpportunity.address,
        project: earnOpportunity.protocol.name,
        integrator: `zap.${earnOpportunity.protocol.name}`,
        integratorLink: earnOpportunity.url,
        integratorPositionLink: earnOpportunity.positionUrl,
        minFromAmountUSD: earnOpportunity.minFromAmountUSD,
      },
    };
  }, [earnOpportunity]);

  return (
    <WidgetTrackingProvider>
      <ZapInitProvider projectData={customInformation.projectData}>
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
              <ZapDepositWidget
                ctx={{
                  theme: {
                    container: {
                      maxHeight: 'calc(100vh - 6rem)',
                      minWidth: '100%',
                      maxWidth: 400,
                    },
                  },
                  taskType: TaskType.Zap,
                  overrideHeader: 'Quick deposit',
                }}
                customInformation={customInformation}
              />
            </ClientOnly>
          </CenteredWrapper>
        </Modal>
      </ZapInitProvider>
    </WidgetTrackingProvider>
  );
};
