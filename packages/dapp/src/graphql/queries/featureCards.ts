import { gql } from '@apollo/client';

//testing card-id: 2BozrMHw7cbgulWz0vd18p
export const getFeatureCardById = gql`
  query {
    featureCard(id: "2BozrMHw7cbgulWz0vd18p") {
      title
      subtitle
      url
      gradientColor
      imageDarkMode {
        url
      }
      imageLightMode {
        url
      }
    }
  }
`;

export const getFeatureCards = gql`
  query {
    featureCardCollection {
      items {
        title
        subtitle
        url
        imageDarkMode {
          url
          title
          width
          height
        }
        imageLightMode {
          url
          title
          width
          height
        }
        gradientColor
        displayConditions
      }
    }
  }
`;
