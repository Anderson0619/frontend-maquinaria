import { gql } from "@apollo/client";
import { IMovimiento } from "types/Movimiento.type";

export interface IGetMovimientoResponse{
    movimientos: IMovimiento[]; 
}

const GET_MOVIMIENTO = gql `
    query GetAllMovimiento{
        movimientos{
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

export default{
    GET_MOVIMIENTO
}