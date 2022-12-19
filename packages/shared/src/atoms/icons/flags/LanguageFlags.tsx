import {
  FlagChina,
  FlagFrance,
  FlagGermany,
  FlagItaly,
  FlagJapan,
  FlagUSA,
} from '@transferto/shared/src/atoms/icons/flags';
import React from 'react';

const LanguageFlags = () => {
  const _LanguageFlags = {
    en: <FlagUSA />,
    zh: <FlagChina />,
    fr: <FlagFrance />,
    de: <FlagGermany />,
    it: <FlagItaly />,
    jp: <FlagJapan />,
  };

  return _LanguageFlags;
};

export default LanguageFlags;
