import { gql } from "@apollo/client";
import { IMovimiento } from "types/Movimiento.type";

export interface ICreateMovimientoInput {
  movimientoNumber: string;
  maquinaria?: string[];
  solicitante?: string;
  autoriza?: string;
  traslado?: string[];
  origen?: string[];
  fechaS?: string;
  fechaT?: string;
  movimiento?: string;
}
   
export interface ICreateMovimientoResponse {
    createMovimiento: IMovimiento
}

const CREATE_MOVIMIENTO = gql`
    mutation CreateMovimiento($createMovimientoInput: CreateMovimientoInput!){
        createMovimiento(createMovimientoInput: $createMovimientoInput){
            id
            movimientoNumber
            maquinaria
            solicitante
            autoriza
            traslado
            origen
            fechaS
            fechaT
            movimiento
            createdAt
        }
    }
`;

export interface IUpdateMovimientoInput extends ICreateMovimientoInput {
    id: string;
}

export interface IUpdateMovimientoResponse{
    updateMovimiento: IMovimiento;
}

const UPDATE_MOVIMIENTO = gql`
    mutation UpdateMovimiento($updateMovimientoInput: UpdateMovimientoInput!){
        updateMovimiento(updateMovimientoInput: $updateMovimientoInput){
            id
            movimientoNumber
            maquinaria
            solicitante
            autoriza
            traslado
            origen
            fechaS
            fechaT
            movimiento
            createdAt
        }
    }
`;

export interface IDeleteMovimientoInput{
    id: string;
}

export interface IDeleteMovimientoResponse {
    deleteMovimiento: IMovimiento;
}

const DELETE_MOVIMIENTO = gql`
    mutation DeleteMovimiento($deleteMovimientoInput: DeleteMovimientoInput!){
            deleteMovimiento(deleteMovimientoInput: $deleteMovimientoInput){
                id
            }
        }
`;

export default {
    CREATE_MOVIMIENTO,
    UPDATE_MOVIMIENTO,
    DELETE_MOVIMIENTO
}