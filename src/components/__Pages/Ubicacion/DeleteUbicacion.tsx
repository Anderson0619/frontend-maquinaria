import { useMutation } from "@apollo/client";
import { useModal } from "context/modal/modal.provider";
import { gqlUbicacion } from "gql";
import { IDeleteUbicacionInput, IDeleteUbicacionResponse } from "gql/Ubicacion/mutations";
import { IUbicacion } from "types/Ubicacion.type";
import toast from "react-hot-toast";
import Header from "components/_Custom/Header/Header";
import { Button } from "rsuite";

interface IDeleteUbicacionProps {
    ubicacion: IUbicacion;
}

const DeleteUbicacion = ({ ubicacion } : IDeleteUbicacionProps) => {
    const { closeModal } = useModal();

    const [deleteUbicacion, { loading: deleteUbicacionLoading }] = useMutation<IDeleteUbicacionResponse, { deleteUbicacionInput: IDeleteUbicacionInput}>(gqlUbicacion.mutations.DELETE_UBICACION, {
        refetchQueries: [{ query: gqlUbicacion.queries.GET_UBICACIONES}],
        update: (cache, { data }) => {
            if( data ) {
                const { deleteUbicacion } = data;

                if(deleteUbicacion) {
                    const { ubicaciones } = cache.readQuery<{ ubicaciones: IUbicacion[]}>({
                        query: gqlUbicacion.queries.GET_UBICACIONES,
                    });
                    if(ubicaciones)
                    cache.writeQuery({
                        query: gqlUbicacion.queries.GET_UBICACIONES,
                        data: {
                            ubicaciones: ubicaciones.filter(
                                (ubicacion) => ubicacion.id !== deleteUbicacion.id,
                            ),
                        },
                    });
                }
            }
        },
        onError: () => {
            toast.error("Error eliminando ubicación");
        },
    });

    const handleDeleteUbicacion = () => {
        try {
            deleteUbicacion({
                variables: {
                    deleteUbicacionInput: {
                        id: ubicacion.id,
                    },
                },
            });
        } catch (error) {
            console.error(error);
        } finally {
            toast.success("Ubicación Eliminada");
            closeModal();
        }
    };

    return (
        <div className="p-6">
            <Header title="Eliminar Control de Ubicación"/>
            <label className="font-bold">
                ¿Estás seguro que deseas eliminar el control de ubicación {ubicacion.ubiNumber}?
            </label>

            <Button 
                appearance="primary"
                className="mt-6 w-full"
                onClick={handleDeleteUbicacion}
                loading={deleteUbicacionLoading}
            >
                Eliminar
            </Button>
        </div>
    )
};

export default DeleteUbicacion;