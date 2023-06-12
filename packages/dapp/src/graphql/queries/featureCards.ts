import { gql } from '@apollo/client';

//testing card-id: 2BozrMHw7cbgulWz0vd18p
export const getGlossaryById = gql`
  query {
    featureCard(id: "2BozrMHw7cbgulWz0vd18p") {
      title
      subtitle
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
