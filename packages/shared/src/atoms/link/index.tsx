import React from 'react';

type Props = {
  url?: string;
  children?: React.ReactNode;
};

export const Link: React.FC<Props> = ({ children, url }) => {
  if (!url) {
    return <>{children}</>;
  } else if (url.startsWith('http')) {
    return (
      <a href={url} target={`_blank`}>
        {children}
      </a>
    );
  } else {
    return <a href={url}>{children}</a>;
  }
};
