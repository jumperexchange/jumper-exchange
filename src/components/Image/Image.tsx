import { ImageWalletMenuButtonStyled } from './Image.style';

export const ImageWalletMenuButton = ({
  src,
  alt,
  width,
  height,
  priority,
  unoptimized,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  unoptimized: boolean;
}) => {
  return (
    <ImageWalletMenuButtonStyled
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
};
