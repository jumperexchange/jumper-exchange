import { gql } from 'graphql-request';

export const superfestNFTCheck = gql`
  query Campaign($id: ID!, $address: String!) {
    campaign(id: $id) {
      numberID
      participationStatus(address: $address)
    }
  }
`;
