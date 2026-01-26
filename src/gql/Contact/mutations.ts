import { gql } from "@apollo/client";

export interface ICreateContactInput {
  name: string;
  email: string;
  city: string;
  comment: string;
}

const CREATE_CONTACT = gql`
  mutation createContact($createContactInput: CreateContactInput!) {
    createContact(createContactInput: $createContactInput) {
      id
    }
  }
`;

export default { CREATE_CONTACT };
