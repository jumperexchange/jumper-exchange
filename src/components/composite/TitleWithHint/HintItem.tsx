import type { TypographyProps } from '@mui/material/Typography';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { TitleWithHintHint } from './TitleWithHint.styles';

const CHAR_WIDTH_LINE_HEIGHT_RATIO = 0.65;
const CHAR_WIDTH_MIN_CHARS = 10;

interface HintItemProps {
  label: ReactNode;
  hoverContent?: ReactNode;
  hintVariant: TypographyProps['variant'];
  dataTestId?: string;
}

export const HintItem: FC<HintItemProps> = ({
  label,
  hoverContent,
  hintVariant,
  dataTestId,
}) => {
  const theme = useTheme();
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showHoverContent, setShowHoverContent] = useState(false);
  const [isHoveringHoverContent, setIsHoveringHoverContent] = useState(false);
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

  if (!hoverContent) {
    return (
      <TitleWithHintHint variant={hintVariant} data-testid={dataTestId}>
        {label}
      </TitleWithHintHint>
    );
  }

  const handleMouseEnter = () => {
    timeoutId.current = setTimeout(() => {
      setShowHoverContent(true);
    }, 350);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId.current);
    if (showHoverContent) {
      setShowHoverContent(false);
    }
    setIsHoveringHoverContent(false);
  };

  const handleHoverContentMouseEnter = () => {
    setIsHoveringHoverContent(true);
  };

  const handleHoverContentMouseLeave = () => {
    setIsHoveringHoverContent(false);
  };

  return (
    <Box
      ref={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-hint-hover-active={isHoveringHoverContent || undefined}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: lineHeight,
        minWidth: `calc(${lineHeight} * ${CHAR_WIDTH_LINE_HEIGHT_RATIO} * ${CHAR_WIDTH_MIN_CHARS})`,
        maxWidth: '100%',
      }}
    >
      <Slide
        direction="down"
        in={!showHoverContent}
        container={container.current}
        style={{ position: 'absolute' }}
        appear={true}
      >
        <TitleWithHintHint variant={hintVariant} data-testid={dataTestId}>
          {label}
        </TitleWithHintHint>
      </Slide>
      <Slide
        direction="up"
        in={showHoverContent}
        container={container.current}
        style={{ position: 'absolute' }}
        appear={false}
        mountOnEnter
      >
        <Box
          sx={{ display: 'inline-flex' }}
          onMouseEnter={handleHoverContentMouseEnter}
          onMouseLeave={handleHoverContentMouseLeave}
        >
          {hoverContent}
        </Box>
      </Slide>
    </Box>
  );
};
