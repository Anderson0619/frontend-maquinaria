import { gql } from "@apollo/client";

const DO_NOTHING = gql`
  mutation {
    doNothing @client
  }
`;

export default { DO_NOTHING };
