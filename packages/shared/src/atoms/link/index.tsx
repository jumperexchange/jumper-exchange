import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  url?: string;
  children?: React.ReactNode;
};

export const Link: React.FC<Props> = ({ children, url }) => {
  const router = useRouter();

  if (!url) {
    return <>{children}</>;
  } else if (url.startsWith("http")) {
    return (
      <a href={url} target={`_blank`}>
        {children}
      </a>
    );
  } else {
    const isActive =
      router.asPath.replaceAll("/", "") === url.replaceAll("/", "");

    return (
      <span className={isActive ? "activeLink" : ""}>
        <NextLink href={url} passHref>
          <a href={url}>{children}</a>
        </NextLink>
      </span>
    );
  }
};
