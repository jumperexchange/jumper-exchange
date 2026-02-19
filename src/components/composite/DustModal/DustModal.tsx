import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC } from 'react';
import { useMemo } from 'react';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import { widgetStyle } from './constants';
import { useDustBalances } from './hooks/useDustBalances';
import { useFallbackNativeToken } from './hooks/useFallbackNativeToken';
import { useDustFormFields } from './hooks/useDustFormFields';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import type { ViewSubmitContext } from '../JumperWidget/types';
import { RouteOverview } from './components/RouteOverview';

interface DustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DustModal: FC<DustModalProps> = ({ isOpen, onClose }) => {
  const { nonNativeBalances, chains, nativeExtendedTokens } = useDustBalances();
  const fallbackNativeToken = useFallbackNativeToken(nativeExtendedTokens);
  const formFields = useDustFormFields({
    chains,
    nonNativeBalances,
    nativeExtendedTokens,
    fallbackNativeToken,
  });

  const views = useMemo(
    () => [
      {
        type: 'form' as const,
        id: 'form',
        title: 'Convert dust',
        fields: formFields,
        onSubmit: async ({ goToView }: ViewSubmitContext) => {
          goToView('summary');
        },
        actions: (
          <Button variant={Variant.Primary} type="submit">
            Review conversion
          </Button>
        ),
      },
      {
        type: 'custom' as const,
        id: 'summary',
        title: 'Convert dust',
        content: <RouteOverview />,
        onSubmit: async ({ goToView }: ViewSubmitContext) => {},
        actions: (
          <Button variant={Variant.Primary} type="submit">
            Convert dust
          </Button>
        ),
      },
    ],
    [formFields],
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      {isOpen ? <JumperWidget views={views} style={widgetStyle} /> : null}
    </ModalContainer>
  );
};
