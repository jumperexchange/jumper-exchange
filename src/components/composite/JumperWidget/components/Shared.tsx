import type { FC, PropsWithChildren } from 'react';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import CheckIcon from '@mui/icons-material/Check';
import {
  ContentContainer,
  Label,
  MenuItemLabel,
  MenuItemWrapper,
} from '../JumperWidget.style';
import { GoBackHeader } from './Headers';
import { useTranslation } from 'react-i18next';

export interface OptionIconProps {
  logoURI?: string;
  name: string;
  id: string;
}

export const OptionIcon: FC<OptionIconProps> = ({ logoURI, name, id }) => (
  <AvatarItem size={AvatarSize.XL} avatar={{ src: logoURI, alt: name, id }} />
);

export interface SelectSideOption {
  key: string;
  logoURI?: string;
  name: string;
}

export interface SelectSidePanelProps extends PropsWithChildren {
  isActive: boolean;
  options: SelectSideOption[];
  isSelected: (key: string) => boolean;
  onSelect: (key: string) => void;
  onClose: () => void;
  header?: string;
}

export const SelectSidePanel: FC<SelectSidePanelProps> = ({
  isActive,
  options,
  isSelected,
  onSelect,
  onClose,
  header,
  children,
}) => {
  const { t } = useTranslation();
  if (!isActive) {
    return null;
  }

  return (
    <>
      {header && <GoBackHeader header={header} onBack={onClose} />}
      <ContentContainer sx={{ gap: 0 }}>
        {options.length ? (
          options.map((option) => {
            const selected = isSelected(option.key);
            return (
              <MenuItemWrapper
                key={option.key}
                disableRipple
                onClick={() => onSelect(option.key)}
                selected={selected}
              >
                <OptionIcon
                  logoURI={option.logoURI}
                  name={option.name}
                  id={option.key}
                />
                <MenuItemLabel>{option.name}</MenuItemLabel>
                {selected && (
                  <CheckIcon
                    sx={{ marginLeft: 'auto', height: 24, width: 24 }}
                  />
                )}
              </MenuItemWrapper>
            );
          })
        ) : (
          <Label>
            {t('jumperWidget.emptyList', {
              itemsName: header?.toLowerCase() || t('jumperWidget.items'),
            })}
          </Label>
        )}
        {children}
      </ContentContainer>
    </>
  );
};
