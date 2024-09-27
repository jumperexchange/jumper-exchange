import { useState, useEffect } from 'react';

const useImageStatus = (imageUrl: string) => {
  const [isImageValid, setIsImageValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(imageUrl);
        if (response.status <= 299) {
          setIsImageValid(true);
        } else {
          setIsImageValid(false);
        }
      } catch (error) {
        setIsImageValid(false);
      }
    };

    checkImage();
  }, [imageUrl]);

  return isImageValid;
};

export default useImageStatus;
