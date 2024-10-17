import { useState, useEffect } from 'react';

const useEffigyLink = (imageUrl: string, defaultImg: string) => {
  const [imgLink, setImgLink] = useState<string>(defaultImg);

  useEffect(() => {
    const getImageLink = async () => {
      try {
        const response = await fetch(imageUrl);
        if (response.status > 299) {
          setImgLink(imageUrl);
        } else {
          setImgLink(defaultImg);
        }
      } catch (error) {
        setImgLink(defaultImg);
      }
    };

    getImageLink();
  }, [imageUrl]);

  return imgLink;
};

export default useEffigyLink;
