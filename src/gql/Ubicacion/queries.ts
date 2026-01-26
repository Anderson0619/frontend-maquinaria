import { gql } from "@apollo/client";
import { IUbicacion } from "types/Ubicacion.type";

export interface IGetUbicacionResponse{
    ubicaciones: IUbicacion[]; 
}

const GET_UBICACIONES = gql `
    query GetAllUbicaciones{
        ubicaciones{
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

export default{
    GET_UBICACIONES
}