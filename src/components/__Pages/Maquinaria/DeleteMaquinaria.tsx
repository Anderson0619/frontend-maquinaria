import { useMutation } from "@apollo/client";
import { useModal } from "context/modal/modal.provider";
import { gqlMaquinaria } from "gql";
import { IDeleteMaquinariaInput, IDeleteMaquinariaResponse } from "gql/Maquinaria/mutations";
import { IMaquinaria } from "types/Maquinaria.type";
import toast from "react-hot-toast";
import Header from "components/_Custom/Header/Header";
import { Button } from "rsuite";

interface IDeleteMaquinariaProps {
    maquinaria: IMaquinaria;
}

const DeleteMaquinaria = ({ maquinaria } : IDeleteMaquinariaProps) => {
    const { closeModal } = useModal();

    const [deleteMaquinaria, { loading: deleteMaquinariaLoading }] = useMutation<IDeleteMaquinariaResponse, { deleteMaquinariaInput: IDeleteMaquinariaInput}>(gqlMaquinaria.mutations.DELETE_MAQUINARIA, {
        refetchQueries: [{ query: gqlMaquinaria.queries.GET_MAQUINARIA}],
        update: (cache, { data }) => {
            if( data ) {
                const { deleteMaquinaria } = data;

                if(deleteMaquinaria) {
                    const { maquinarias } = cache.readQuery<{ maquinarias: IMaquinaria[]}>({
                        query: gqlMaquinaria.queries.GET_MAQUINARIA,
                    });
                    if(maquinarias)
                    cache.writeQuery({
                        query: gqlMaquinaria.queries.GET_MAQUINARIA,
                        data: {
                            maquinarias: maquinarias.filter(
                                (maquinaria) => maquinaria.id !== deleteMaquinaria.id,
                            ),
                        },
                    });
                }
            }
        },
        onError: () => {
            toast.error("Error eliminando control");
        },
    });

    const handleDeleteMaquinaria = () => {
        try {
            deleteMaquinaria({
                variables: {
                    deleteMaquinariaInput: {
                        id: maquinaria.id,
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
            <Header title="Eliminar Control de Maquinaria"/>
            <label className="font-bold">
                ¿Estás seguro que deseas eliminar el control de maquinaria {maquinaria.maquiNumber}?
            </label>

            <Button 
                appearance="primary"
                className="mt-6 w-full"
                onClick={handleDeleteMaquinaria}
                loading={deleteMaquinariaLoading}
            >
                Eliminar
            </Button>
        </div>
    )
};

export default DeleteMaquinaria;