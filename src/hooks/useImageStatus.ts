import { useEffect, useState } from 'react';
import { DEFAULT_EFFIGY } from 'src/const/urls';

const useImageStatus = (address: string | undefined) => {
  const [validImage, setValidImage] = useState<string>(DEFAULT_EFFIGY);
  const imageUrl = `https://effigy.im/a/${address}.png`;

  useEffect(() => {
    if (!address) {
      return;
    }
    const checkImage = async () => {
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
          setValidImage(imageUrl);
        }
      } catch (error) {
        setValidImage(DEFAULT_EFFIGY);
      }
    };

    checkImage();
  }, [imageUrl, address]);

  return validImage;
};

export default useImageStatus;
