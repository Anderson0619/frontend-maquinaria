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

    const estadoOptions = [
        { label: "Activo", value: "1", color: "bg-green-100 text-green-800" },
        { label: "Inactivo", value: "2", color: "bg-red-100 text-red-800" },
    ];

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
            estado: maquinaria?.estado || estadoOptions[0].label,
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
    { label: "MOTONIVELADORAS", value: "MV", color: "bg-orange-100 text-orange-800" },
    { label: "MINICARGADORAS", value: "MC", color: "bg-blue-100 text-blue-800" },
    { label: "TRACTORES", value: "TO", color: "bg-cyan-100 text-cyan-800" },
    { label: "EXCAVADORAS", value: "EX", color: "bg-red-100 text-red-800" },
    { label: "RETROEXCAVADORAS", value: "RX", color: "bg-green-100 text-green-800" },
    { label: "RODILLOS", value: "RC", color: "bg-purple-100 text-purple-800" },
    { label: "CARGADORA FRONTAL", value: "CF", color: "bg-yellow-100 text-yellow-800" },
    { label: "FINISHER", value: "TA", color: "bg-gray-100 text-gray-800" },
    { label: "MONTACARGA", value: "MG", color: "bg-pink-100 text-pink-800" },
    { label: "PLANTA LUZ", value: "PL", color: "bg-indigo-100 text-indigo-800" },
    { label: "GRAVILLADORA", value: "GV", color: "bg-teal-100 text-teal-800" },
    { label: "TRITURADORA", value: "TP", color: "bg-rose-100 text-rose-800" },
    { label: "ZARANDA", value: "CP", color: "bg-amber-100 text-amber-800" },
    { label: "TELEHANDER", value: "TH", color: "bg-emerald-100 text-emerald-800" },
    { label: "BOMBA DE HORMIGON", value: "BH", color: "bg-violet-100 text-violet-800" },
    { label: "GRUA", value: "CG", color: "bg-fuchsia-100 text-fuchsia-800" },
    { label: "FESADORAS", value: "RA", color: "bg-sky-100 text-sky-800" },
    { label: "GENERADORES", value: "GN", color: "bg-lime-100 text-lime-800" },
    { label: "DRILL", value: "DR", color: "bg-rose-100 text-rose-800" },
    { label: "BARREDORA MÉCANICA", value: "BM", color: "bg-amber-100 text-amber-800" },
    { label: "PAVIMENTADORA DE HORMIGON", value: "PV", color: "bg-emerald-100 text-emerald-800" },
    { label: "PLANTA DE ASFALTO", value: "PA", color: "bg-violet-100 text-violet-800" },
    { label: "PLANTA DE HORMIGON", value: "PH", color: "bg-fuchsia-100 text-fuchsia-800" },
    { label: "SAPITOS COMPACTADORES", value: "03", color: "bg-sky-100 text-sky-800" },
    { label: "COMPRESOR MOTOR", value: "04", color: "bg-lime-100 text-lime-800" },
    { label: "PLANCHAS COMPACTADORA", value: "05", color: "bg-orange-100 text-orange-800" },
    { label: "COMPRESOR DE AIRE PEQUEÑO", value: "06", color: "bg-blue-100 text-blue-800" },
    { label: "BOMBA DE ENGRASAR / ACEITE", value: "07", color: "bg-cyan-100 text-cyan-800" },
    { label: "CONCRETERA", value: "09", color: "bg-red-100 text-red-800" },
    { label: "RODILLO DOBLE TAMBOR PEQUEÑO", value: "10", color: "bg-green-100 text-green-800" },
    { label: "CORTADORA DE CONCRETO", value: "11", color: "bg-purple-100 text-purple-800" },
    { label: "SOPLADOR DE AIRE", value: "12", color: "bg-yellow-100 text-yellow-800" },
    { label: "ENGRASADORA DE PIE", value: "13", color: "bg-gray-100 text-gray-800" },
    { label: "BOMBA DE AGUA", value: "14", color: "bg-pink-100 text-pink-800" },
    { label: "LAVADORA MOVIL", value: "15", color: "bg-indigo-100 text-indigo-800" },
    { label: "VIBRADOR DE CONCRETO", value: "16", color: "bg-teal-100 text-teal-800" },
    { label: "PULIDORA", value: "17", color: "bg-rose-100 text-rose-800" },
    { label: "PLANTA ELECTRICA", value: "18", color: "bg-amber-100 text-amber-800" },
    { label: "CORTADORA DE CESPED", value: "19", color: "bg-emerald-100 text-emerald-800" },
    { label: "BOMBA SUMERGIBLE", value: "20", color: "bg-violet-100 text-violet-800" },
    { label: "MOTOSOLDADORA", value: "21", color: "bg-fuchsia-100 text-fuchsia-800" },
    { label: "EXTRACTOR DE NÚCLEO", value: "22", color: "bg-sky-100 text-sky-800" },
    { label: "ROTO MARTILLO MANUAL", value: "RT", color: "bg-lime-100 text-lime-800" },
    { label: "COMPRESOR DE AIRE GRANDE", value: "CA", color: "bg-orange-100 text-orange-800" },
    { label: "DISTRIBUIDOR DE AGREGADOS-CHANCHITO", value: "CE", color: "bg-blue-100 text-blue-800" },
    { label: "BOMBA DE COMBUSTIBLE", value: "BC", color: "bg-cyan-100 text-cyan-800" },
    { label: "MIXER", value: "MX", color: "bg-red-100 text-red-800" },
    { label: "VOLQUETE", value: "02", color: "bg-green-100 text-green-800" },
    { label: "TANQUERO", value: "TQ", color: "bg-purple-100 text-purple-800" },
    { label: "JEEP", value: "JP", color: "bg-yellow-100 text-yellow-800" },
    { label: "CAMIONETAS", value: "08", color: "bg-gray-100 text-gray-800" },
    { label: "ESPARCIDOR ASFALTO", value: "EA", color: "bg-pink-100 text-pink-800" },
    { label: "CABEZAL", value: "01", color: "bg-indigo-100 text-indigo-800" },
    { label: "CABEZAL TLP", value: "TL", color: "bg-teal-100 text-teal-800" },
    { label: "BAÑERAS", value: "BÑ", color: "bg-rose-100 text-rose-800" },
    { label: "PLATAFORMAS", value: "PLT", color: "bg-amber-100 text-amber-800" },
    { label: "CAMA BAJA", value: "CB", color: "bg-emerald-100 text-emerald-800" },
    { label: "CONTENEDORES", value: "CT", color: "bg-violet-100 text-violet-800" },
    { label: "CHASIS", value: "CH", color: "bg-fuchsia-100 text-fuchsia-800" },
    { label: "CISTERNA DE CEMENTO (VACA)", value: "CC", color: "bg-sky-100 text-sky-800" },
    { label: "TANQUE DE ASFALTO", value: "TA", color: "bg-lime-100 text-lime-800" },
    { label: "TANQUERO DE COMBUSTIBLE", value: "TQC", color: "bg-orange-100 text-orange-800" },
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
                            <Col xs={24} md={8}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        ID de Maquinaria *
                                        {!isEditMode && (
                                            <span className="ml-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                                Único
                                            </span>
                                        )}
                                    </label>
                                    <Controller
                                        name="maquiNumber"
                                        control={control}
                                        rules={{ 
                                            required: "Este campo es requerido",
                                            minLength: {
                                                value: 3,
                                                message: "Mínimo 3 caracteres"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                placeholder="Ej: MAQ-001, EXC-2024"
                                                disabled={isEditMode} // Si es edición, no se puede cambiar
                                                className={`border-2 ${errors.maquiNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${isEditMode ? 'bg-gray-100' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.maquiNumber && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.maquiNumber.message}
                                        </div>
                                    )}
                                    <p className="text-gray-500 text-sm mt-2">
                                        {isEditMode 
                                            ? "El número de maquinaria no puede ser modificado"
                                            : "Ingrese un identificador único para esta maquinaria"
                                        }
                                    </p>
                                </div>
                            </Col>
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
                                                        <span className={`px-2 py-1 rounded  text-sm font-medium`}>
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
                                        Estado {isEditMode && "*"}
                                    </label>
                                    <Controller
                                        name="estado"
                                        control={control}
                                        rules={{ required: isEditMode ? "Este campo es requerido" : false }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                disabled={!isEditMode} // Se deshabilita si no está en modo edición
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
                                                placeholder={isEditMode ? "Seleccione el estado" : "Disponible al editar"}
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.estado ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${!isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                renderValue={(value, item) => {
                                                    if (!isEditMode && !value) {
                                                        return (
                                                            <span className="px-3 py-1 rounded text-gray-500 font-medium">
                                                                Disponible al editar
                                                            </span>
                                                        );
                                                    }
                                                    
                                                    const selectedOption = estadoOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded ${selectedOption?.color || 'bg-gray-100'} font-medium`}>
                                                            {value || "Seleccionar"}
                                                        </span>
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.estado && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.estado.message}
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