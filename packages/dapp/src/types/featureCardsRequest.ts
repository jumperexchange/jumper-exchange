export interface FeatureCardsResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: Array<FeatureCardsItems>;
  includes: { Asset: FeactureCardsAsset };
}

export interface FeatureCardsItems {
  fields: {
    displayConditions: {
      id: string;
      showOnce: boolean;
    }[];
    imageDarkMode: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
    imageLightMode: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
    subtitle: string;
    title: string;
    url: string;
  };
  metadata: {
    tags: string[];
  };
  sys: {
    contentType: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
    createdAt: string;
    environment: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
    id: string;
    locale: string;
    revision: number;
    space: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
    type: string;
    updatedAt: string;
  };
}

export interface FeactureCardsAsset {
  metadata: {
    tags: string[];
  };
  sys: {
    space: {
      sys: {
        type: string;
        linkType: string;
        id: string;
      };
    };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: string;
        linkType: string;
      };
    };
    revision: number;
    locale: string;
  };
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}
