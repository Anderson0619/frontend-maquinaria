import { gql } from "@apollo/client";
import { IMaquinaria } from "types/Maquinaria.type";

export interface IGetMaquinariaResponse{
    maquinarias: IMaquinaria[]; 
}

const GET_MAQUINARIA = gql `
    query GetAllMaquinaria{
        maquinarias{
            id
            maquiNumber
            type
            mark
            model
            anio
            description
            createdAt
        }
    }
`;

export default{
    GET_MAQUINARIA
}