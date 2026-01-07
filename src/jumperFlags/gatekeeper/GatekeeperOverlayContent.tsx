import { CustomColor } from '@/components/CustomColorTypography.style';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenSubtitle,
} from '@/components/WelcomeScreen/WelcomeScreen.style';
import type { FC, PropsWithChildren } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface GatekeeperOverlayContentProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export const GatekeeperOverlayContent: FC<GatekeeperOverlayContentProps> = ({
  title,
  subtitle,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <ContentWrapper>
      <WelcomeContent>
        <CustomColor as="h1" variant="urbanistTitle2XLarge">
          {title}
        </CustomColor>
        <WelcomeScreenSubtitle
          variant={'bodyLarge'}
          sx={{
            maxWidth: '484px',
            marginX: 'auto',
            marginTop: 1,
            marginBottom: 4,
          }}
        >
          <Trans components={[<strong />]}>{subtitle}</Trans>
        </WelcomeScreenSubtitle>
        {children}
      </WelcomeContent>
    </ContentWrapper>
  );
};
