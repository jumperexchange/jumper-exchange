import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { ReactNode } from 'react';

const client = new ApolloClient({
  uri: `https://graphql.contentful.com/content/v1/spaces/55dvf9f8kaqk`,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN}`,
  },
});

interface ApolloPrivderProps {
  children: ReactNode;
}

export const ContentfulProvider = ({ children }: ApolloPrivderProps) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
