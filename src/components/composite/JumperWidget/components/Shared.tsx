import {
  useId,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import Typography from '@mui/material/Typography';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import CheckIcon from '@mui/icons-material/Check';
import {
  CardRowButton,
  CardTitleContainer,
  CardValue,
  ContentContainer,
  FieldWrapper,
  Label,
  MenuItemLabel,
  MenuItemWrapper,
} from '../JumperWidget.style';
import { GoBackHeader } from './Headers';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import { Stack } from '@mui/system';
import { MenuList } from '@mui/material';

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
  description?: string;
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
      <ContentContainer sx={{ gap: 0, overflow: 'auto', flex: 1 }}>
        <MenuList sx={{ padding: 0, margin: 0 }}>
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
                  <Stack direction="column" spacing={0.5} sx={{ minWidth: 0 }}>
                    <MenuItemLabel
                      sx={option.description ? { fontWeight: 700 } : {}}
                    >
                      {option.name}
                    </MenuItemLabel>
                    {option.description && (
                      <Typography variant="bodyXSmall" color="text.secondary">
                        {option.description}
                      </Typography>
                    )}
                  </Stack>
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
        </MenuList>
      </ContentContainer>
    </>
  );
};

interface SettingCardExpandableProps extends PropsWithChildren {
  icon: ReactNode;
  title: ReactNode;
  value: ReactNode;
  disabled?: boolean;
  keepValueVisible?: boolean;
  onEntered?: () => void;
}

export const SettingCardExpandable: FC<SettingCardExpandableProps> = ({
  icon,
  title,
  value,
  children,
  disabled,
  keepValueVisible,
  onEntered,
}) => {
  const [expanded, setExpanded] = useState(false);
  const buttonId = useId();
  const collapseId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleExpanded = (forceExpanded?: boolean) => {
    const newExpanded = forceExpanded ?? !expanded;
    setExpanded(newExpanded);
  };

  return (
    <FieldWrapper sx={{ p: 1 }}>
      <CardRowButton
        ref={buttonRef}
        id={buttonId}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={disabled ? undefined : () => toggleExpanded()}
        disableRipple
        sx={{ p: 1, cursor: disabled ? 'default' : 'pointer' }}
      >
        <CardTitleContainer>
          {icon}
          <CardValue>{title}</CardValue>
        </CardTitleContainer>
        {(!expanded || keepValueVisible) && value}
      </CardRowButton>
      <Collapse
        id={collapseId}
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
        mountOnEnter
        unmountOnExit
        onEntered={onEntered}
      >
        {children}
      </Collapse>
    </FieldWrapper>
  );
};
