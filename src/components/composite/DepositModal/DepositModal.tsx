import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { ZapInitProvider } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { TaskType } from 'src/types/strapi';
import { CenteredWrapper, CloseIconButton } from './DepositModal.styles';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';

interface DepositModalProps {
  onClose: () => void;
  isOpen: boolean;
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
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
  const customInformation =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

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
                customInformation={customInformation}
              />
            </ClientOnly>
          </CenteredWrapper>
        </Modal>
      </ZapInitProvider>
    </WidgetTrackingProvider>
  );
};
