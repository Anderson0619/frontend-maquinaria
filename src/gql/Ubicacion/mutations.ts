import { gql } from "@apollo/client";
import { IUbicacion } from "types/Ubicacion.type";

export interface ICreateUbicacionInput {
    ubiNumber?: string;
    type?: string;
    ubicacion?: string;
    provincia?: string;
    canton?: string;
    encargado?: string;
    description?: string;
}
   
export interface ICreateUbicacionResponse {
    createUbicacion: IUbicacion
}

const CREATE_UBICACION = gql`
    mutation CreateUbicacion($createUbicacionInput: CreateUbicacionInput!){
        createUbicacion(createUbicacionInput: $createUbicacionInput){
            id
            ubiNumber
            type
            ubicacion
            provincia
            canton
            encargado
            description
            createdAt
        }
    }
`;

export interface IUpdateUbicacionInput extends ICreateUbicacionInput {
    id: string;
}

export interface IUpdateUbicacionResponse{
    updateUbicacion: IUbicacion;
}

const UPDATE_UBICACION = gql`
    mutation UpdateUbicacion($updateUbicacionInput: UpdateUbicacionInput!){
        updateUbicacion(updateUbicacionInput: $updateUbicacionInput){
            id
            ubiNumber
            type
            ubicacion
            provincia
            canton
            encargado
            description
            createdAt
        }
    }
`;

export interface IDeleteUbicacionInput{
    id: string;
}

export interface IDeleteUbicacionResponse {
    deleteUbicacion: IUbicacion;
}

const DELETE_UBICACION = gql`
    mutation DeleteUbicacion($deleteUbicacionInput: DeleteUbicacionInput!){
            deleteUbicacion(deleteUbicacionInput: $deleteUbicacionInput){
                id
            }
        }
`;

export default {
    CREATE_UBICACION,
    UPDATE_UBICACION,
    DELETE_UBICACION
}