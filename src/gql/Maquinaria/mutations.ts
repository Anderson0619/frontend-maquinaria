import { gql } from "@apollo/client";
import { IMaquinaria } from "types/Maquinaria.type";

export interface ICreateMaquinariaInput {
    maquiNumber?: string;
    type?: string;
    mark?: string;
    model?: string;
    anio?: string;
    description?: string;
    estado?: string;
    location?: string;
    detalle?: string;
}
   
export interface ICreateMaquinariaResponse {
    createMaquinaria: IMaquinaria
}

const CREATE_MAQUINARIA = gql`
    mutation CreateMaquinaria($createMaquinariaInput: CreateMaquinariaInput!){
        createMaquinaria(createMaquinariaInput: $createMaquinariaInput){
            id
            maquiNumber
            type
            mark
            model
            anio
            description
            estado
            location
            detalle
            createdAt
        }
    }
`;

export interface IUpdateMaquinariaInput extends ICreateMaquinariaInput {
    id: string;
}

export interface IUpdateMaquinariaResponse{
    updateMaquinaria: IMaquinaria;
}

const UPDATE_MAQUINARIA = gql`
    mutation UpdateMaquinaria($updateMaquinariaInput: UpdateMaquinariaInput!){
        updateMaquinaria(updateMaquinariaInput: $updateMaquinariaInput){
            id
            maquiNumber
            type
            mark
            model
            anio
            description
            estado
            location
            detalle
            createdAt
        }
    }
`;

export interface IDeleteMaquinariaInput{
    id: string;
}

export interface IDeleteMaquinariaResponse {
    deleteMaquinaria: IMaquinaria;
}

const DELETE_MAQUINARIA = gql`
    mutation DeleteMaquinaria($deleteMaquinariaInput: DeleteMaquinariaInput!){
            deleteMaquinaria(deleteMaquinariaInput: $deleteMaquinariaInput){
                id
            }
        }
`;

export default {
    CREATE_MAQUINARIA,
    UPDATE_MAQUINARIA,
    DELETE_MAQUINARIA
}