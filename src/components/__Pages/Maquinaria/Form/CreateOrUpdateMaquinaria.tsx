import { useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlMaquinaria, gqlUbicacion } from "gql";
import { ICreateMaquinariaInput, ICreateMaquinariaResponse, IUpdateMaquinariaInput } from "gql/Maquinaria/mutations";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, Col, Input, Row, SelectPicker, Panel, Form, InputGroup, Loader, Message, Tag } from "rsuite";
import { IMaquinaria } from "types/Maquinaria.type";
import { IUbicacion } from "types/Ubicacion.type";
import { useProfile } from "context/profile/profile.context";

interface IEditMaquinariaProps {
    maquinaria?: IMaquinaria;
}

const CreateOrUpdateMaquinaria = ({ maquinaria }: IEditMaquinariaProps) => {
    const { closeDrawer } = useDrawer();
    const { user } = useProfile();
    const isEditMode = !!maquinaria;

    const [selectedValue, setSelectedValue] = useState("");
    const [firstUserToClick, setFirstUserToClick] = useState<string | null>(null);
    

    const handleSelectChange = (value: string) => {
        setSelectedValue(value);
        if (firstUserToClick === null && value === "si") {
            setFirstUserToClick(`${user.name} ${user.lastname}`);
        }
    };

    const { data, loading, refetch } = useQuery(gqlMaquinaria.queries.GET_MAQUINARIA);

    const { data: ubicacionesData } = useQuery<{ ubicaciones: IUbicacion[] }>(
        gqlUbicacion.queries.GET_UBICACIONES,
        {
            fetchPolicy: "network-only"
        }
    );

    const [createMaquinaria, { loading: createMaquinariaLoading }] = 
        useMutation<ICreateMaquinariaResponse>(gqlMaquinaria.mutations.CREATE_MAQUINARIA, {
            update: (cache, { data }) => {
                if (data) {
                    const { createMaquinaria } = data;
                    if (createMaquinaria) {
                        const { maquinarias } = cache.readQuery<{ maquinarias: IMaquinaria[] }>({
                            query: gqlMaquinaria.queries.GET_MAQUINARIA,
                        }) || { maquinarias: [] };

                        cache.writeQuery({
                            query: gqlMaquinaria.queries.GET_MAQUINARIA,
                            data: { 
                                maquinarias: [...maquinarias, createMaquinaria]
                            },
                        });
                    }
                }
            }
        });

    const [updateMaquinaria, { loading: updateMaquinariaLoading }] = useMutation<
        IUpdateMaquinariaInput, 
        { updateMaquinariaInput: IUpdateMaquinariaInput }
    >(gqlMaquinaria.mutations.UPDATE_MAQUINARIA, {
        update: (cache, { data }) => {
            if (data) {
                const updatedData = data;
                const { maquinarias } = cache.readQuery<{ maquinarias: IMaquinaria[] }>({
                    query: gqlMaquinaria.queries.GET_MAQUINARIA,
                }) || { maquinarias: [] };

                const updatedMaquinarias = maquinarias.map(item => 
                    item.id === maquinaria?.id ? { ...item, ...updatedData } : item
                );

                cache.writeQuery({
                    query: gqlMaquinaria.queries.GET_MAQUINARIA,
                    data: { maquinarias: updatedMaquinarias },
                });
            }
        }
    });

    const handleCreateOrUpdateMaquinaria = async (formData: ICreateMaquinariaInput) => {
        try {
            if (maquinaria) {
                await updateMaquinaria({
                    variables: {
                        updateMaquinariaInput: {
                            id: maquinaria.id,
                            ...formData
                        },
                    },
                });
                toast.success("✅ Maquinaria actualizada exitosamente");
            } else {
                await createMaquinaria({
                    variables: {
                        createMaquinariaInput: formData,
                    },
                });
                toast.success("✅ Maquinaria creada exitosamente");
            }
            refetch();
            closeDrawer();
        } catch (error) {
            console.error(error);
            toast.error("❌ Error al procesar la solicitud");
        }
    };

    const {
        control, 
        handleSubmit, 
        setValue,
        formState: { errors, isDirty },
    } = useForm<ICreateMaquinariaInput>({
        defaultValues: {
            maquiNumber: maquinaria?.maquiNumber || "",
            type: maquinaria?.type || "",
            mark: maquinaria?.mark || "",
            model: maquinaria?.model || "",
            anio: maquinaria?.anio || "",
            estado: maquinaria?.estado || "",
            location: maquinaria?.location || "",
            detalle: maquinaria?.detalle || "",
            description: maquinaria?.description || "",
        },
        mode: "onChange"
    });

    const onSubmitRSuite = (checkStatus: boolean, event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(handleCreateOrUpdateMaquinaria)();
    };

    const [selectedMaquinaria, setSelectedMaquinaria] = useState<string | null>(
        maquinaria?.location || null
    );

    const handleMaquinariaChange = (value: string | null) => {
        setSelectedMaquinaria(value);
        setValue("location", value ? value : '');
    };

    const ubicacionOptions = [
        { label: "Obra", value: "1", color: "bg-orange-100 text-orange-800" },
        { label: "Alquiler", value: "2", color: "bg-blue-100 text-blue-800" },
        { label: "Campamento", value: "3", color: "bg-cyan-100 text-cyan-800" },
        { label: "Taller", value: "4", color: "bg-red-100 text-red-800" },
    ];

    const tipoOptions = [
        { label: "Volqueta", value: "1", color: "bg-orange-100 text-orange-800" },
        { label: "Minicargadora", value: "2", color: "bg-blue-100 text-blue-800" },
        { label: "Draga", value: "3", color: "bg-cyan-100 text-cyan-800" },
        { label: "Aplanadora o Compactadora", value: "4", color: "bg-red-100 text-red-800" },
        { label: "Excavadora", value: "5", color: "bg-green-100 text-green-800" },
        { label: "Retroexcavadora", value: "6", color: "bg-purple-100 text-purple-800" },
        { label: "Bulldozer", value: "7", color: "bg-yellow-100 text-yellow-800" },
        { label: "Grúa", value: "8", color: "bg-gray-100 text-gray-800" },
        { label: "Pavimentadora", value: "9", color: "bg-pink-100 text-pink-800" },
    ];

    const estadoOptions = [
        { label: "Activo", value: "1", color: "bg-green-100 text-green-800" },
        { label: "Inactivo", value: "2", color: "bg-red-100 text-red-800" },
    ];

    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
            <Header title={isEditMode ? "EDITAR MAQUINARIA" : "NUEVA MAQUINARIA"} />
            
            <Panel 
                bordered 
                className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden"
                header={
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-2xl flex items-center gap-3">
                                {isEditMode ? "✏️ Editar Maquinaria" : "➕ Registrar Nueva Maquinaria"}
                            </h3>
                            {isEditMode && maquinaria && (
                                <Tag className="bg-white text-indigo-600 font-bold px-4 py-1 rounded-full">
                                    ID: {maquinaria.maquiNumber}
                                </Tag>
                            )}
                        </div>
                        <p className="text-indigo-100 mt-2">
                            {isEditMode 
                                ? "Actualice la información de la maquinaria existente" 
                                : "Complete todos los campos para registrar una nueva maquinaria"
                            }
                        </p>
                    </div>
                }
            >
                {/* Usa un form nativo en lugar del Form de RSuite */}
                <form onSubmit={handleSubmit(handleCreateOrUpdateMaquinaria)}>
                    {/* Sección de Información Básica */}
                    <div className="p-6 border-b border-gray-200">
                        <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">⚙️</span>
                            Información Básica
                        </h4>
                        
                        <Row gutter={16}>
                            {/* Tipo de Maquinaria */}
                            <Col xs={24} md={8}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Tipo de Maquinaria *
                                    </label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={tipoOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded ${opt.color} text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={false}
                                                placeholder="Seleccione el tipo"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                renderValue={(value, item) => {
                                                    const selectedOption = tipoOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded ${selectedOption?.color} font-medium`}>
                                                            {value || "Seleccionar"}
                                                        </span>
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.type && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.type.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Ubicación *
                                    </label>
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={ubicacionOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded ${opt.color} text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={false}
                                                placeholder="Seleccione la ubicación"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                renderValue={(value, item) => {
                                                    const selectedOption = ubicacionOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded ${selectedOption?.color} font-medium`}>
                                                            {value || "Seleccionar"}
                                                        </span>
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.type && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.type.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Estado *
                                    </label>
                                    <Controller
                                        name="estado"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={estadoOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded ${opt.color} text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={false}
                                                placeholder="Seleccione el estado"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.estado ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                renderValue={(value, item) => {
                                                    const selectedOption = estadoOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded ${selectedOption?.color} font-medium`}>
                                                            {value || "Seleccionar"}
                                                        </span>
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.type && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.type.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16} className="mt-4">
                            {/* Marca */}
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Marca *
                                    </label>
                                    <Controller
                                        name="mark"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                placeholder="Ej: Caterpillar, Komatsu" 
                                                className={`border-2 ${errors.mark ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.mark && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.mark.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Modelo */}
                            <Col xs={24} md={6}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Modelo *
                                    </label>
                                    <Controller
                                        name="model"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                placeholder="Ej: D6T, PC200" 
                                                className={`border-2 ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.model && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.model.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Año */}
                            <Col xs={24} md={6}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Año *
                                    </label>
                                    <Controller
                                        name="anio"
                                        control={control}
                                        rules={{ 
                                            required: "Este campo es requerido",
                                            pattern: {
                                                value: /^\d{4}$/,
                                                message: "Ingrese un año válido (4 dígitos)"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                placeholder="2024" 
                                                maxLength={4}
                                                className={`border-2 ${errors.anio ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.anio && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.anio.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="p-6">
                        <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📝</span>
                            Características de la Maquinaria
                        </h4>
                        
                        <div className="mb-4">
                            <label className="font-bold text-gray-700 mb-2 block">
                                Descripción Detallada
                            </label>
                            <Controller
                                name="detalle"
                                control={control}
                                render={({ field }) => (
                                    <Input 
                                        {...field} 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Describa las características de la maquinaria..."
                                        className="border-2 border-gray-300 rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                                    />
                                )}
                            />
                            <p className="text-gray-500 text-sm mt-2">
                                Incluya información relevante de la maquinaria
                            </p>
                        </div>
                    </div>

                    {/* Sección de Descripción */}
                    <div className="p-6">
                        <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📝</span>
                            Descripción y Detalles
                        </h4>
                        
                        <div className="mb-4">
                            <label className="font-bold text-gray-700 mb-2 block">
                                Descripción Detallada
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input 
                                        {...field} 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Describa las características, condiciones, equipamiento adicional, horas de uso, estado actual..."
                                        className="border-2 border-gray-300 rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                                    />
                                )}
                            />
                            <p className="text-gray-500 text-sm mt-2">
                                Incluya información relevante para el control y mantenimiento de la maquinaria
                            </p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                        <Button
                            type="button"
                            appearance="subtle"
                            onClick={closeDrawer}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                            disabled={createMaquinariaLoading || updateMaquinariaLoading}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            type="submit"
                            appearance="primary"
                            className="px-8 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            loading={createMaquinariaLoading || updateMaquinariaLoading}
                            disabled={!isDirty && isEditMode}
                        >
                            {isEditMode ? "Actualizar Maquinaria" : "Crear Maquinaria"}
                        </Button>
                    </div>
                </form>
            </Panel>

            {/* Overlay de carga */}
            {(createMaquinariaLoading || updateMaquinariaLoading) && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="text-center">
                        <Loader size="lg" />
                        <p className="mt-4 text-gray-600 font-medium">
                            {isEditMode ? "Actualizando maquinaria..." : "Creando maquinaria..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateOrUpdateMaquinaria;