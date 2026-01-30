import { useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlUbicacion } from "gql";
import { ICreateUbicacionInput, ICreateUbicacionResponse, IUpdateUbicacionInput } from "gql/Ubicacion/mutations";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, Col, Input, Row, SelectPicker, Panel, Form, InputGroup, Loader, Message, Tag } from "rsuite";
import { IUbicacion } from "types/Ubicacion.type";
import { useProfile } from "context/profile/profile.context";

interface IEditUbicacionProps {
    ubicacion?: IUbicacion;
}

const CreateOrUpdateUbicacion = ({ ubicacion }: IEditUbicacionProps) => {
    const { closeDrawer } = useDrawer();
    const { user } = useProfile();
    const isEditMode = !!ubicacion;

    const [selectedValue, setSelectedValue] = useState("");
    const [firstUserToClick, setFirstUserToClick] = useState<string | null>(null);

    const handleSelectChange = (value: string) => {
        setSelectedValue(value);
        if (firstUserToClick === null && value === "si") {
            setFirstUserToClick(`${user.name} ${user.lastname}`);
        }
    };

    const { data, loading, refetch } = useQuery(gqlUbicacion.queries.GET_UBICACIONES);

    const [createUbicacion, { loading: createUbicacionLoading }] = 
        useMutation<ICreateUbicacionResponse>(gqlUbicacion.mutations.CREATE_UBICACION, {
            update: (cache, { data }) => {
                if (data) {
                    const { createUbicacion } = data;
                    if (createUbicacion) {
                        const { ubicaciones } = cache.readQuery<{ ubicaciones: IUbicacion[] }>({
                            query: gqlUbicacion.queries.GET_UBICACIONES,
                        }) || { ubicaciones: [] };

                        cache.writeQuery({
                            query: gqlUbicacion.queries.GET_UBICACIONES,
                            data: { 
                                ubicaciones: [...ubicaciones, createUbicacion]
                            },
                        });
                    }
                }
            }
        });

    const [updateUbicacion, { loading: updateUbicacionLoading }] = useMutation<
        IUpdateUbicacionInput, 
        { updateUbicacionInput: IUpdateUbicacionInput }
    >(gqlUbicacion.mutations.UPDATE_UBICACION, {
        update: (cache, { data }) => {
            if (data) {
                const updatedData = data;
                const { ubicaciones } = cache.readQuery<{ ubicaciones: IUbicacion[] }>({
                    query: gqlUbicacion.queries.GET_UBICACIONES,
                }) || { ubicaciones: [] };

                const updatedUbicaciones = ubicaciones.map(item => 
                    item.id === ubicacion?.id ? { ...item, ...updatedData } : item
                );

                cache.writeQuery({
                    query: gqlUbicacion.queries.GET_UBICACIONES,
                    data: { ubicaciones: updatedUbicaciones },
                });
            }
        }
    });

    const handleCreateOrUpdateUbicacion = async (formData: ICreateUbicacionInput) => {
        try {
            if (ubicacion) {
                await updateUbicacion({
                    variables: {
                        updateUbicacionInput: {
                            id: ubicacion.id,
                            ...formData
                        },
                    },
                });
                toast.success("✅ Ubicación actualizada exitosamente");
            } else {
                await createUbicacion({
                    variables: {
                        createUbicacionInput: formData,
                    },
                });
                toast.success("✅ Ubicación creada exitosamente");
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
        formState: { errors, isDirty },
    } = useForm<ICreateUbicacionInput>({
        defaultValues: {
            ubiNumber: ubicacion?.ubiNumber || "",
            type: ubicacion?.type || "",
            ubicacion: ubicacion?.ubicacion || "",
            provincia: ubicacion?.provincia || "",  
            canton: ubicacion?.canton || "",
            encargado: ubicacion?.encargado || "",
            description: ubicacion?.description || "",
        },
        mode: "onChange"
    });

    const onSubmitRSuite = (checkStatus: boolean, event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(handleCreateOrUpdateUbicacion)();
    };

    const tipoOptions = [
        { label: "Tipo 1", value: "1", color: "bg-orange-100 text-orange-800" },
        { label: "Tipo 2", value: "2", color: "bg-blue-100 text-blue-800" },
        { label: "Tipo 3", value: "3", color: "bg-cyan-100 text-cyan-800" },
        { label: "Tipo 4", value: "4", color: "bg-red-100 text-red-800" },
    ];

    const ubicacionOptions = [
        { label: "Obra", value: "1", color: "bg-orange-100 text-orange-800" },
        { label: "Alquiler", value: "2", color: "bg-blue-100 text-blue-800" },
        { label: "Campamento", value: "3", color: "bg-cyan-100 text-cyan-800" },
        { label: "Taller", value: "4", color: "bg-red-100 text-red-800" },
        { label: "Cantera", value: "5", color: "bg-red-100 text-red-800" },
    ];

    const provinciaOptions = [
        { label: "Azuay", value: "1" },
        { label: "Bolívar", value: "2" },
        { label: "Carchi", value: "3"},
        { label: "Cañar", value: "4" },
        { label: "Chimborazo", value: "5" },
        { label: "Cotopaxi", value: "6" },
        { label: "El Oro", value: "7" },
        { label: "Esmeraldas", value: "8" },
        { label: "Galápagos", value: "9" },
        { label: "Guayas", value: "10" },
        { label: "Imbabura", value: "11" },
        { label: "Loja", value: "12" },
        { label: "Los Ríos", value: "13" },
        { label: "Manabí", value: "14" },
        { label: "Morona Santiago", value: "15" },
        { label: "Napo", value: "16" },
        { label: "Orellana", value: "17" },
        { label: "Pastaza", value: "18" },
        { label: "Pichincha", value: "19" },
        { label: "Santa Elena", value: "20" },
        { label: "Santo Domingo de los Tsáchilas", value: "21" },
        { label: "Sucumbíos", value: "22" },
        { label: "Tungurahua", value: "23" },
        { label: "Zamora Chinchipe", value: "24" },
    ];

    const cantonOptions = [
  // Azuay
  { label: "Cuenca", value: "1" },
  { label: "Girón", value: "2" },
  { label: "Gualaceo", value: "3" },
  { label: "Nabón", value: "4" },
  { label: "Paute", value: "5" },
  { label: "Pucará", value: "6" },
  { label: "San Fernando", value: "7" },
  { label: "Santa Isabel", value: "8" },
  { label: "Sigsig", value: "9" },
  { label: "Oña", value: "10" },
  { label: "Chordeleg", value: "11" },
  { label: "El Pan", value: "12" },
  { label: "Sevilla de Oro", value: "13" },
  { label: "Guachapala", value: "14" },
  { label: "Camilo Ponce Enríquez", value: "15" },

  // Bolívar
  { label: "Guaranda", value: "16" },
  { label: "Chillanes", value: "17" },
  { label: "Chimbo", value: "18" },
  { label: "Echeandía", value: "19" },
  { label: "San Miguel", value: "20" },
  { label: "Caluma", value: "21" },
  { label: "Las Naves", value: "22" },

  // Cañar
  { label: "Azogues", value: "23" },
  { label: "Biblián", value: "24" },
  { label: "Cañar", value: "25" },
  { label: "La Troncal", value: "26" },
  { label: "El Tambo", value: "27" },
  { label: "Déleg", value: "28" },
  { label: "Suscal", value: "29" },

  // Carchi
  { label: "Tulcán", value: "30" },
  { label: "Bolívar", value: "31" },
  { label: "Espejo", value: "32" },
  { label: "Mira", value: "33" },
  { label: "Montúfar", value: "34" },
  { label: "San Pedro de Huaca", value: "35" },

  // Chimborazo
  { label: "Riobamba", value: "36" },
  { label: "Alausí", value: "37" },
  { label: "Colta", value: "38" },
  { label: "Chambo", value: "39" },
  { label: "Chunchi", value: "40" },
  { label: "Guamote", value: "41" },
  { label: "Guano", value: "42" },
  { label: "Pallatanga", value: "43" },
  { label: "Penipe", value: "44" },
  { label: "Cumandá", value: "45" },

  // Cotopaxi
  { label: "Latacunga", value: "46" },
  { label: "La Maná", value: "47" },
  { label: "Pangua", value: "48" },
  { label: "Pujilí", value: "49" },
  { label: "Salcedo", value: "50" },
  { label: "Saquisilí", value: "51" },
  { label: "Sigchos", value: "52" },

  // El Oro
  { label: "Machala", value: "53" },
  { label: "Arenillas", value: "54" },
  { label: "Atahualpa", value: "55" },
  { label: "Balsas", value: "56" },
  { label: "Chilla", value: "57" },
  { label: "El Guabo", value: "58" },
  { label: "Huaquillas", value: "59" },
  { label: "Marcabelí", value: "60" },
  { label: "Pasaje", value: "61" },
  { label: "Piñas", value: "62" },
  { label: "Portovelo", value: "63" },
  { label: "Santa Rosa", value: "64" },
  { label: "Zaruma", value: "65" },
  { label: "Las Lajas", value: "66" },

  // Esmeraldas
  { label: "Esmeraldas", value: "67" },
  { label: "Eloy Alfaro", value: "68" },
  { label: "Muisne", value: "69" },
  { label: "Quinindé", value: "70" },
  { label: "San Lorenzo", value: "71" },
  { label: "Atacames", value: "72" },
  { label: "Rioverde", value: "73" },
  { label: "La Concordia", value: "74" },

  // Galápagos
  { label: "San Cristóbal", value: "75" },
  { label: "Santa Cruz", value: "76" },
  { label: "Isabela", value: "77" },

  // Guayas
  { label: "Guayaquil", value: "78" },
  { label: "Alfredo Baquerizo Moreno", value: "79" },
  { label: "Balao", value: "80" },
  { label: "Balzar", value: "81" },
  { label: "Colimes", value: "82" },
  { label: "Daule", value: "83" },
  { label: "Durán", value: "84" },
  { label: "El Empalme", value: "85" },
  { label: "El Triunfo", value: "86" },
  { label: "Milagro", value: "87" },
  { label: "Naranjal", value: "88" },
  { label: "Naranjito", value: "89" },
  { label: "Palestina", value: "90" },
  { label: "Pedro Carbo", value: "91" },
  { label: "Samborondón", value: "92" },
  { label: "Santa Lucía", value: "93" },
  { label: "Salitre", value: "94" },
  { label: "San Jacinto de Yaguachi", value: "95" },
  { label: "Playas", value: "96" },
  { label: "Simón Bolívar", value: "97" },
  { label: "Coronel Marcelino Maridueña", value: "98" },
  { label: "Lomas de Sargentillo", value: "99" },
  { label: "Nobol", value: "100" },
  { label: "General Antonio Elizalde", value: "101" },
  { label: "Isidro Ayora", value: "102" },

  // Imbabura
  { label: "Ibarra", value: "103" },
  { label: "Antonio Ante", value: "104" },
  { label: "Cotacachi", value: "105" },
  { label: "Otavalo", value: "106" },
  { label: "Pimampiro", value: "107" },
  { label: "San Miguel de Urcuquí", value: "108" },

  // Loja
  { label: "Loja", value: "109" },
  { label: "Calvas", value: "110" },
  { label: "Catamayo", value: "111" },
  { label: "Celica", value: "112" },
  { label: "Chaguarpamba", value: "113" },
  { label: "Espíndola", value: "114" },
  { label: "Gonzanamá", value: "115" },
  { label: "Macará", value: "116" },
  { label: "Paltas", value: "117" },
  { label: "Puyango", value: "118" },
  { label: "Saraguro", value: "119" },
  { label: "Sozoranga", value: "120" },
  { label: "Zapotillo", value: "121" },
  { label: "Pindal", value: "122" },
  { label: "Quilanga", value: "123" },
  { label: "Olmedo", value: "124" },

    // Los Ríos
  { label: "Babahoyo", value: "125" },
  { label: "Baba", value: "126" },
  { label: "Montalvo", value: "127" },
  { label: "Puebloviejo", value: "128" },
  { label: "Quevedo", value: "129" },
  { label: "Urdaneta", value: "130" },
  { label: "Ventanas", value: "131" },
  { label: "Vínces", value: "132" },
  { label: "Palenque", value: "133" },
  { label: "Buena Fe", value: "134" },
  { label: "Valencia", value: "135" },
  { label: "Mocache", value: "136" },
  { label: "Quinsaloma", value: "137" },

  // Manabí
  { label: "Portoviejo", value: "138" },
  { label: "Bolívar", value: "139" },
  { label: "Chone", value: "140" },
  { label: "El Carmen", value: "141" },
  { label: "Flavio Alfaro", value: "142" },
  { label: "Jipijapa", value: "143" },
  { label: "Junín", value: "144" },
  { label: "Manta", value: "145" },
  { label: "Montecristi", value: "146" },
  { label: "Paján", value: "147" },
  { label: "Pichincha", value: "148" },
  { label: "Rocafuerte", value: "149" },
  { label: "Santa Ana", value: "150" },
  { label: "Sucre", value: "151" },
  { label: "Tosagua", value: "152" },
  { label: "24 de Mayo", value: "153" },
  { label: "Pedernales", value: "154" },
  { label: "Olmedo", value: "155" },
  { label: "Puerto López", value: "156" },
  { label: "Jama", value: "157" },
  { label: "Jaramijó", value: "158" },
  { label: "San Vicente", value: "159" },

  // Morona Santiago
  { label: "Morona", value: "160" },
  { label: "Gualaquiza", value: "161" },
  { label: "Limón Indanza", value: "162" },
  { label: "Palora", value: "163" },
  { label: "Santiago", value: "164" },
  { label: "Sucúa", value: "165" },
  { label: "Huamboya", value: "166" },
  { label: "San Juan Bosco", value: "167" },
  { label: "Taisha", value: "168" },
  { label: "Logroño", value: "169" },
  { label: "Pablo Sexto", value: "170" },
  { label: "Tiwintza", value: "171" },

  // Napo
  { label: "Tena", value: "172" },
  { label: "Archidona", value: "173" },
  { label: "El Chaco", value: "174" },
  { label: "Quijos", value: "175" },
  { label: "Carlos Julio Arosemena Tola", value: "176" },

  // Orellana
  { label: "Orellana", value: "177" },
  { label: "Aguarico", value: "178" },
  { label: "La Joya de los Sachas", value: "179" },
  { label: "Loreto", value: "180" },

  // Pastaza
  { label: "Pastaza", value: "181" },
  { label: "Mera", value: "182" },
  { label: "Santa Clara", value: "183" },
  { label: "Arajuno", value: "184" },

  // Pichincha
  { label: "Quito", value: "185" },
  { label: "Cayambe", value: "186" },
  { label: "Mejía", value: "187" },
  { label: "Pedro Moncayo", value: "188" },
  { label: "Rumiñahui", value: "189" },
  { label: "San Miguel de los Bancos", value: "190" },
  { label: "Pedro Vicente Maldonado", value: "191" },
  { label: "Puerto Quito", value: "192" },

  // Santa Elena
  { label: "Santa Elena", value: "193" },
  { label: "La Libertad", value: "194" },
  { label: "Salinas", value: "195" },

  // Santo Domingo de los Tsáchilas
  { label: "Santo Domingo", value: "196" },
  { label: "La Concordia", value: "197" },

  // Sucumbíos
  { label: "Lago Agrio", value: "198" },
  { label: "Gonzalo Pizarro", value: "199" },
  { label: "Putumayo", value: "200" },
  { label: "Shushufindi", value: "201" },
  { label: "Sucumbíos", value: "202" },
  { label: "Cascales", value: "203" },
  { label: "Cuyabeno", value: "204" },

  // Tungurahua
  { label: "Ambato", value: "205" },
  { label: "Baños de Agua Santa", value: "206" },
  { label: "Cevallos", value: "207" },
  { label: "Mocha", value: "208" },
  { label: "Patate", value: "209" },
  { label: "Quero", value: "210" },
  { label: "San Pedro de Pelileo", value: "211" },
  { label: "Santiago de Píllaro", value: "212" },
  { label: "Tisaleo", value: "213" },

  // Zamora Chinchipe
  { label: "Zamora", value: "214" },
  { label: "Chinchipe", value: "215" },
  { label: "Nangaritza", value: "216" },
  { label: "Yacuambi", value: "217" },
  { label: "Yantzaza", value: "218" },
  { label: "El Pangui", value: "219" },
  { label: "Centinela del Cóndor", value: "220" },
  { label: "Palanda", value: "221" },
  { label: "Paquisha", value: "222" },
    ];


    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
            <Header title={isEditMode ? "EDITAR UBICACIÓN" : "NUEVA UBICACIÓN"} />
            
            <Panel 
                bordered 
                className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden"
                header={
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-2xl flex items-center gap-3">
                                {isEditMode ? "✏️ Editar Ubicación" : "➕ Registrar Nueva Ubicación"}
                            </h3>
                            {isEditMode && ubicacion && (
                                <Tag className="bg-white text-indigo-600 font-bold px-4 py-1 rounded-full">
                                    ID: {ubicacion.ubiNumber}
                                </Tag>
                            )}
                        </div>
                        <p className="text-indigo-100 mt-2">
                            {isEditMode 
                                ? "Actualice la información de la ubicación existente" 
                                : "Complete todos los campos para registrar una nueva ubicación"
                            }
                        </p>
                    </div>
                }
            >
                {/* Usa un form nativo en lugar del Form de RSuite */}
                <form onSubmit={handleSubmit(handleCreateOrUpdateUbicacion)}>
                    {/* Sección de Información Básica */}
                    <div className="p-6 border-b border-gray-200">
                        <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">⚙️</span>
                            Información Básica
                        </h4>
                        
                        <Row gutter={16}>
                            {/* Tipo */}
                            <Col xs={24} md={24}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Ubicación *
                                    </label>
                                    <Controller
                                        name="ubicacion"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                className={`border-2 ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                autoComplete="off"
                                            />  
                                        )}
                                    />
                                    {errors.ubicacion && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.ubicacion.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Tipo *
                                    </label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={ubicacionOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={false}
                                                placeholder="Seleccione la ubicación"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
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
                             { /* Encargado */}
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Encargado *
                                    </label>
                                    <Controller
                                        name="encargado"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                className={`border-2 ${errors.encargado ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                autoComplete="off"
                                            />                                        
                                        )}
                                    />
                                    {errors.encargado && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.encargado.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16} className="mt-4">                            

                            {/* Provincia */}
                            {/* <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Provincia 
                                    </label>
                                    <Controller
                                        name="provincia"
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={provinciaOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={true}
                                                placeholder="Seleccione la provincia"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.provincia ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                renderValue={(value, item) => {
                                                    const selectedOption = provinciaOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded font-medium`}>
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
                            </Col> */}

                            {/* Cantón */}
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Cantón 
                                    </label>
                                    <Controller
                                        name="canton"
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={cantonOptions.map(opt => ({
                                                    label: (
                                                        <span className={`px-2 py-1 rounded text-sm font-medium`}>
                                                            {opt.label}
                                                        </span>
                                                    ),
                                                    value: opt.label
                                                }))}
                                                block
                                                searchable={true}
                                                placeholder="Seleccione el cantón"
                                                menuClassName="shadow-lg border-0 rounded-lg"
                                                className={`border-2 ${errors.canton ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                                renderValue={(value, item) => {
                                                    const selectedOption = cantonOptions.find(opt => opt.value === value);
                                                    return (
                                                        <span className={`px-3 py-1 rounded font-medium`}>
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
                                        //placeholder="Describa las características, condiciones, equipamiento adicional, horas de uso, estado actual..."
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
                            disabled={createUbicacionLoading || updateUbicacionLoading}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            type="submit"
                            appearance="primary"
                            className="px-8 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            loading={createUbicacionLoading || updateUbicacionLoading}
                            disabled={!isDirty && isEditMode}
                        >
                            {isEditMode ? "Actualizar Ubicación" : "Crear Ubicación"}
                        </Button>
                    </div>
                </form>
            </Panel>

            {/* Overlay de carga */}
            {(createUbicacionLoading || updateUbicacionLoading) && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="text-center">
                        <Loader size="lg" />
                        <p className="mt-4 text-gray-600 font-medium">
                            {isEditMode ? "Actualizando ubicación..." : "Creando ubicación..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateOrUpdateUbicacion;