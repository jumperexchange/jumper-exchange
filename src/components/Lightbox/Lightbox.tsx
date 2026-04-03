import type { StrapiMediaAttributes } from '@/types/strapi';
import { Fade } from '@mui/material';
import {
  LightboxContainer,
  LightboxImage,
  LightboxModal,
  PreviewImage,
} from './Lightbox.style';
import { LightboxToolbar } from './LightboxToolbar';
import { useLightbox } from './useLightbox';

interface LightboxProps {
  baseUrl: string;
  imageData: StrapiMediaAttributes;
}

export const Lightbox = ({ baseUrl, imageData }: LightboxProps) => {
  const {
    open,
    scale,
    offset,
    isFullscreen,
    supportsFullscreen,
    containerRef,
    isDragging,
    handleOpen,
    handleClose,
    zoomIn,
    zoomOut,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleFullscreen,
  } = useLightbox();

  return (
    <>
      <PreviewImage
        src={imageData.url}
        width={0}
        height={0}
        sizes="100vw"
        alt={imageData.alternativeText ?? 'article-image'}
        onClick={handleOpen}
      />

      <LightboxModal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open} timeout={500}>
          <LightboxContainer
            ref={containerRef}
            onClick={handleClose}
            onWheel={handleWheel}
          >
            <LightboxToolbar
              scale={scale}
              isFullscreen={isFullscreen}
              supportsFullscreen={supportsFullscreen}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onToggleFullscreen={toggleFullscreen}
              onClose={handleClose}
            />

            <LightboxImage
              src={imageData.url}
              alt={imageData.alternativeText ?? 'article-image'}
              scale={scale}
              offsetX={offset.x}
              offsetY={offset.y}
              isDragging={isDragging.current}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />
          </LightboxContainer>
        </Fade>
      </LightboxModal>
    </>
  );
};
