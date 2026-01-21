import type { TypographyProps } from '@mui/material/Typography';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  TitleWithHintContainer,
  TitleWithHintTitle,
  TitleWithHintHint,
} from './TitleWithHint.styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip } from 'src/components/core/Tooltip/Tooltip';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

const CHAR_WIDTH_LINE_HEIGHT_RATIO = 0.65;
const CHAR_WIDTH_MIN_CHARS = 10;

interface TitleWithHintProps extends PropsWithChildren {
  title: string;
  titleVariant: TypographyProps['variant'];
  titleTooltip?: string;
  titleDataTestId?: string;
  hint?: string;
  hintOnHover?: ReactNode;
  hintVariant?: TypographyProps['variant'];
  hintDataTestId?: string;
  gap?: number;
  sx?: SxProps<Theme>;
}

export const TitleWithHint: FC<TitleWithHintProps> = ({
  title,
  titleTooltip,
  hint,
  hintOnHover,
  titleVariant,
  hintVariant,
  titleDataTestId,
  hintDataTestId,
  gap,
  children,
  sx,
}) => {
  const theme = useTheme();
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showHintOnHover, setShowHintOnHover] = useState(false);
  const [isHoveringHintContent, setIsHoveringHintContent] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const typographyStyles =
    theme.typography[hintVariant as keyof typeof theme.typography];
  const lineHeight =
    typeof typographyStyles === 'object' && 'lineHeight' in typographyStyles
      ? typographyStyles.lineHeight
      : '1.5em';

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    timeoutId.current = setTimeout(() => {
      if (hintOnHover) {
        setShowHintOnHover(true);
      }
    }, 350);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId.current);
    if (showHintOnHover) {
      setShowHintOnHover(false);
    }
    setIsHoveringHintContent(false);
  };

  const handleHintMouseEnter = () => {
    setIsHoveringHintContent(true);
  };

  const handleHintMouseLeave = () => {
    setIsHoveringHintContent(false);
  };

  return (
    <TitleWithHintContainer
      gap={gap}
      sx={sx}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-hint-hover-active={isHoveringHintContent || undefined}
    >
      <TitleWithHintTitle variant={titleVariant} data-testid={titleDataTestId}>
        {titleTooltip ? (
          <Tooltip title={titleTooltip}>
            <span>{title}</span>
          </Tooltip>
        ) : (
          title
        )}
      </TitleWithHintTitle>
      {children
        ? children
        : hintVariant &&
          hint &&
          (hintOnHover ? (
            <Box
              ref={container}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: lineHeight,
                minWidth: `calc(${lineHeight} * ${CHAR_WIDTH_LINE_HEIGHT_RATIO} * ${CHAR_WIDTH_MIN_CHARS})`,
              }}
            >
              <Slide
                direction="down"
                in={!showHintOnHover}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={true}
              >
                <TitleWithHintHint
                  variant={hintVariant}
                  data-testid={hintDataTestId}
                >
                  {hint}
                </TitleWithHintHint>
              </Slide>
              <Slide
                direction="up"
                in={showHintOnHover}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={false}
                mountOnEnter
              >
                <Box
                  sx={{ display: 'inline-flex' }}
                  onMouseEnter={handleHintMouseEnter}
                  onMouseLeave={handleHintMouseLeave}
                >
                  {hintOnHover}
                </Box>
              </Slide>
            </Box>
          ) : (
            <TitleWithHintHint
              variant={hintVariant}
              data-testid={hintDataTestId}
            >
              {hint}
            </TitleWithHintHint>
          ))}
    </TitleWithHintContainer>
  );
};
