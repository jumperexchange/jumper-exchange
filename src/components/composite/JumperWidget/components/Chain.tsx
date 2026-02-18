import type { FC } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import type { ExtendedChain } from '@lifi/sdk';
import { FieldWrapper, Label, Placeholder, Value } from '../JumperWidget.style';
import Box from '@mui/material/Box';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { OptionIcon, SelectSidePanel } from './Shared';

export const chainSingleSelectSchema = z.object({
  selectedChain: z.number().min(1),
});

export type ChainSingleSelectValue = z.infer<typeof chainSingleSelectSchema>;

export interface ChainSingleSelectFieldProps extends BaseFieldProps {
  label?: string;
  header?: string;
  placeholder?: string;
  availableChains: ExtendedChain[];
}

export const ChainSingleSelectField: FC<ChainSingleSelectFieldProps> = ({
  label,
  placeholder = 'Select chain',
  fieldKey,
  availableChains,
}) => {
  const field = useField<ChainSingleSelectValue>(fieldKey);

  const selectedChain = availableChains.find(
    (c) => c.id === field.value?.selectedChain,
  );

  return (
    <FieldWrapper onClick={field.openSidePanel} sx={{ cursor: 'pointer' }}>
      {!!label && <Label>{label}</Label>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {selectedChain ? (
          <>
            <OptionIcon
              logoURI={selectedChain.logoURI}
              name={selectedChain.name}
              id={selectedChain.id.toString()}
            />
            <Value>{selectedChain.name}</Value>
          </>
        ) : (
          <>
            <AvatarSkeleton size={AvatarSize.XL} variant="circular" />
            <Placeholder>{placeholder}</Placeholder>
          </>
        )}
      </Box>
    </FieldWrapper>
  );
};

export const ChainSingleSelectSidePanel: FC<ChainSingleSelectFieldProps> = ({
  fieldKey,
  header,
  availableChains,
}) => {
  const field = useField<ChainSingleSelectValue>(fieldKey);

  return (
    <SelectSidePanel
      isActive={field.isActive}
      header={header}
      options={availableChains.map((c) => ({
        key: c.id.toString(),
        logoURI: c.logoURI,
        name: c.name,
      }))}
      isSelected={(key) => field.value?.selectedChain === Number(key)}
      onSelect={(key) => field.setValue({ selectedChain: Number(key) })}
      onClose={field.closeSidePanel}
    />
  );
};
