interface Image {
  url: string;
  width?: number;
  height?: number;
}

interface OpenGraph {
  title?: string;
  description?: string;
  siteName?: string;
  images?: Image[];
  type?: string;
}

interface Twitter {
  site?: string;
  title?: string;
  description?: string;
  images?: string;
}

interface Icons {
  icon?: {
    url: string;
    sizes?: string;
    media?: string;
  }[];
  shortcut?: {
    url: string;
    sizes: string;
    media: string;
  }[];
}

export interface Metadata {
  title?: string;
  openGraph?: OpenGraph;
  twitter?: Twitter;
  icons?: Icons;
}
