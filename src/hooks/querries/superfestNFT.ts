import { gql } from 'graphql-request';

export const availableNFTs = gql`
  query issuedPDAs($EVMAddress: String!) {
    issuedPDAs(
      filter: {
        organization: { type: GATEWAY_ID, value: "lifi" }
        owner: { type: EVM, value: $EVMAddress }
      }
      skip: 0
      take: 300
      order: { issuanceDate: "DESC" }
    ) {
      id
      status
      ownerHash
      dataAsset {
        claim
        title
        description
        image
        dataModel {
          id
        }
        owner {
          gatewayId
          walletId
        }
      }
    }
  }
`;
