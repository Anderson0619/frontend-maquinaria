import { gql } from "@apollo/client";
import { IRole } from "types/Role.type";

export interface IGetRolesResponse {
  getAllRoles: IRole[];
}

const GET_ALL_ROLES = gql`
  query GetAllRoles {
    getAllRoles {
      id
      createdAt
      name
      routes
      deletable
      editable
    }
  }
`;

export default { GET_ALL_ROLES };
