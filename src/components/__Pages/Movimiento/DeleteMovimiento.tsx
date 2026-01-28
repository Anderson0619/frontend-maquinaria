import { useMutation } from "@apollo/client";
import { useModal } from "context/modal/modal.provider";
import { gqlMovimiento } from "gql";
import { IDeleteMovimientoInput, IDeleteMovimientoResponse } from "gql/Movimiento/mutations";
import { IMovimiento } from "types/Movimiento.type";
import toast from "react-hot-toast";
import Header from "components/_Custom/Header/Header";
import { Button } from "rsuite";

interface IDeleteMovimientoProps {
    movimiento: IMovimiento;
}

const DeleteMovimiento = ({ movimiento } : IDeleteMovimientoProps) => {
    const { closeModal } = useModal();

    const [deleteMovimiento, { loading: deleteMovimientoLoading }] = useMutation<IDeleteMovimientoResponse, { deleteMovimientoInput: IDeleteMovimientoInput}>(gqlMovimiento.mutations.DELETE_MOVIMIENTO, {
        refetchQueries: [{ query: gqlMovimiento.queries.GET_MOVIMIENTO}],
        update: (cache, { data }) => {
            if( data ) {
                const { deleteMovimiento } = data;

                if(deleteMovimiento) {
                    const { movimientos } = cache.readQuery<{ movimientos: IMovimiento[]}>({
                        query: gqlMovimiento.queries.GET_MOVIMIENTO,
                    });
                    if(movimientos)
                    cache.writeQuery({
                        query: gqlMovimiento.queries.GET_MOVIMIENTO,
                        data: {
                            movimientos: movimientos.filter(
                                (movimiento) => movimiento.id !== deleteMovimiento.id,
                            ),
                        },
                    });
                }
            }
        },
        onError: () => {
            toast.error("Error eliminando movimiento");
        },
    });

    const handleDeleteMovimiento = () => {
        try {
            deleteMovimiento({
                variables: {
                    deleteMovimientoInput: {
                        id: movimiento.id,
                    },
                },
            });
        } catch (error) {
            console.error(error);
        } finally {
            toast.success("Control Eliminado");
            closeModal();
        }
    };

    return (
        <div className="p-6">
            <Header title="Eliminar Control de Movimiento"/>
            <label className="font-bold">
                ¿Estás seguro que deseas eliminar el control de movimiento {movimiento.movimientoNumber}?
            </label>

            <Button 
                appearance="primary"
                className="mt-6 w-full"
                onClick={handleDeleteMovimiento}
                loading={deleteMovimientoLoading}
            >
                Eliminar
            </Button>
        </div>
    )
};

export default DeleteMovimiento;