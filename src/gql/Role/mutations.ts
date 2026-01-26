import { gql } from "@apollo/client";
import { ERoutePath } from "routes/routes";
import { IRole } from "types/Role.type";

export interface ICreateRoleInput {
  id: string;
  name: string;
  routes: ERoutePath[];
}

export interface ICreateRoleResponse {
  createRole: IRole;
}

const CREATE_ROLE = gql`
  mutation CreateRole($createRoleInput: CreateRoleInput!) {
    createRole(createRoleInput: $createRoleInput) {
      id
      name
      routes
      vendor
      createdAt
      deletable
      editable
    }
  }
`;

export interface IDeleteRoleInput {
  id: string;
}

export interface IDeleteRoleResponse {
  deleteRole: IRole;
}

const DELETE_ROLE = gql`
  mutation DeleteRole($deleteRoleInput: DeleteRoleInput!) {
    deleteRole(deleteRoleInput: $deleteRoleInput) {
      id
    }
  }
`;

export interface IUpdateRoleInput extends ICreateRoleInput {}

export interface IUpdateRoleResponse {
  updateRole: IRole;
}

const UPDATE_ROLE = gql`
  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {
    updateRole(updateRoleInput: $updateRoleInput) {
      id
      name
      routes
      vendor
      createdAt
      deletable
      editable
    }
  }
`;

export default { CREATE_ROLE, DELETE_ROLE, UPDATE_ROLE };
