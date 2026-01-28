import { useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlMovimiento, gqlMaquinaria, gqlUbicacion } from "gql";
import { ICreateMovimientoInput, ICreateMovimientoResponse, IUpdateMovimientoInput } from "gql/Movimiento/mutations";
import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button, Col, Input, Row, SelectPicker, Panel, Form, InputGroup, Loader, Message, Tag, TagPicker } from "rsuite";
import { IMovimiento } from "types/Movimiento.type";
import { IMaquinaria } from "types/Maquinaria.type";
import { IUbicacion } from "types/Ubicacion.type";
import { useProfile } from "context/profile/profile.context";

interface IEditMovimientoProps {
    movimiento?: IMovimiento;
}

const CreateOrUpdateMovimiento = ({ movimiento }: IEditMovimientoProps) => {
    const { closeDrawer } = useDrawer();
    const { user } = useProfile();
    const isEditMode = !!movimiento;

    const [selectedMaquinaria, setSelectedMaquinaria] = useState<string | null>(
        movimiento?.maquinaria?.[0] || null
    );
    const [historialMaquinaria, setHistorialMaquinaria] = useState<IMovimiento[]>([]);
    const [ubicacionesHistorial, setUbicacionesHistorial] = useState<IUbicacion[]>([]);
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    const { data: allMovimientosData, loading: loadingMovimientos } = useQuery<{ movimientos: IMovimiento[] }>(
        gqlMovimiento.queries.GET_MOVIMIENTO,
        {
            fetchPolicy: "network-only"
        }
    );

    const { data: allUbicacionesData } = useQuery<{ ubicaciones: IUbicacion[] }>(
        gqlUbicacion.queries.GET_UBICACIONES,
        {
            fetchPolicy: "network-only"
        }
    );

    const { data: maquinariaData } = useQuery<{ maquinarias: IMaquinaria[] }>(gqlMaquinaria.queries.GET_MAQUINARIA);
    const { data: ubicacionData } = useQuery<{ ubicaciones: IUbicacion[] }>(gqlUbicacion.queries.GET_UBICACIONES);

    useEffect(() => {
        if (selectedMaquinaria && allMovimientosData?.movimientos) {
            setLoadingHistorial(true);
            
            const historial = allMovimientosData.movimientos.filter(mov => {
                if (Array.isArray(mov.maquinaria)) {
                    return mov.maquinaria.includes(selectedMaquinaria);
                } else if (typeof mov.maquinaria === 'string') {
                    return mov.maquinaria === selectedMaquinaria;
                }
                return false;
            });
            
            const historialOrdenado = historial.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setHistorialMaquinaria(historialOrdenado);
            
            if (allUbicacionesData?.ubicaciones) {
                const lugaresUnicos = new Set<string>();
                
                historialOrdenado.forEach(mov => {
                    if (Array.isArray(mov.origen)) {
                        mov.origen.forEach(lugar => {
                            if (lugar) lugaresUnicos.add(lugar);
                        });
                    } else if (mov.origen) {
                        lugaresUnicos.add(mov.origen);
                    }
                    
                    // Procesar traslado
                    if (Array.isArray(mov.traslado)) {
                        mov.traslado.forEach(lugar => {
                            if (lugar) lugaresUnicos.add(lugar);
                        });
                    } else if (mov.traslado) {
                        lugaresUnicos.add(mov.traslado);
                    }
                });

                // Filtrar ubicaciones que coinciden con los lugares del historial
                const ubicacionesFiltradas = allUbicacionesData.ubicaciones.filter(ubicacion => 
                    Array.from(lugaresUnicos).some(lugar => 
                        ubicacion.canton?.includes(lugar) || 
                        ubicacion.provincia?.includes(lugar) ||
                        lugar.includes(ubicacion.canton || '') ||
                        lugar.includes(ubicacion.provincia || '')
                    )
                );
                
                setUbicacionesHistorial(ubicacionesFiltradas);
            }
            
            setLoadingHistorial(false);
        } else {
            setHistorialMaquinaria([]);
            setUbicacionesHistorial([]);
        }
    }, [selectedMaquinaria, allMovimientosData, allUbicacionesData]);

    const getLugarMasFrecuente = (movimientos: IMovimiento[], tipo: 'origen' | 'traslado') => {
        const lugares = new Map<string, number>();
        
        movimientos.forEach(mov => {
            let lugarValue = '';
            if (Array.isArray(mov[tipo])) {
                lugarValue = mov[tipo][0] || '';
            } else {
                lugarValue = mov[tipo] || '';
            }
            
            if (lugarValue) {
                lugares.set(lugarValue, (lugares.get(lugarValue) || 0) + 1);
            }
        });
        
        let maxCount = 0;
        let lugarMasFrecuenteValue = '';
        
        lugares.forEach((count, lugarValue) => {
            if (count > maxCount) {
                maxCount = count;
                lugarMasFrecuenteValue = lugarValue;
            }
        });
        
        if (!lugarMasFrecuenteValue) return 'N/A';
        
        const cantonEncontrado = cantonOptions.find(opt => opt.value === lugarMasFrecuenteValue);
        
        if (!cantonEncontrado) {
            const cantonPorLabel = cantonOptions.find(opt => opt.label === lugarMasFrecuenteValue);
            return cantonPorLabel ? cantonPorLabel.label : lugarMasFrecuenteValue;
        }
        
        return cantonEncontrado.label;
    };

    // Mutaciones para crear/actualizar
    const [createMovimiento, { loading: createMovimientoLoading }] = 
        useMutation<ICreateMovimientoResponse>(gqlMovimiento.mutations.CREATE_MOVIMIENTO, {
            update: (cache, { data }) => {
                if (data) {
                    const { createMovimiento } = data;
                    if (createMovimiento) {
                        const { movimientos } = cache.readQuery<{ movimientos: IMovimiento[] }>({
                            query: gqlMovimiento.queries.GET_MOVIMIENTO,
                        }) || { movimientos: [] };

                        cache.writeQuery({
                            query: gqlMovimiento.queries.GET_MOVIMIENTO,
                            data: { 
                                movimientos: [...movimientos, createMovimiento]
                            },
                        });
                    }
                }
            }
        });

    const [updateMovimiento, { loading: updateMovimientoLoading }] = useMutation<
        IUpdateMovimientoInput, 
        { updateMovimientoInput: IUpdateMovimientoInput }
    >(gqlMovimiento.mutations.UPDATE_MOVIMIENTO, {
        update: (cache, { data }) => {
            if (data) {
                const updatedData = data;
                const { movimientos } = cache.readQuery<{ movimientos: IMovimiento[] }>({
                    query: gqlMovimiento.queries.GET_MOVIMIENTO,
                }) || { movimientos: [] };

                const updatedMovimientos = movimientos.map(item => 
                    item.id === movimiento?.id ? { ...item, ...updatedData } : item
                );

                cache.writeQuery({
                    query: gqlMovimiento.queries.GET_MOVIMIENTO,
                    data: { movimientos: updatedMovimientos },
                });
            }
        }
    });

    const handleCreateOrUpdateMovimiento = async (formData: ICreateMovimientoInput) => {
        try {
            if (movimiento) {
                await updateMovimiento({
                    variables: {
                        updateMovimientoInput: {
                            id: movimiento.id,
                            ...formData
                        },
                    },
                });
                toast.success("✅ Movimiento actualizado exitosamente");
            } else {
                await createMovimiento({
                    variables: {
                        createMovimientoInput: formData,
                    },
                });
                toast.success("✅ Movimiento creado exitosamente");
            }
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
        setValue,
        watch
    } = useForm<ICreateMovimientoInput>({
        defaultValues: {
            movimientoNumber: movimiento?.movimientoNumber || "",
            maquinaria: movimiento?.maquinaria || [],
            solicitante: movimiento?.solicitante || "",
            autoriza: movimiento?.autoriza || "",
            traslado: movimiento?.traslado || [],
            origen: movimiento?.origen || [],
            fechaS: movimiento?.fechaS || "",
            fechaT: movimiento?.fechaT || "",
            movimiento: movimiento?.movimiento || "",
        },
        mode: "onChange"
    });

    const handleMaquinariaChange = (value: string | null) => {
        setSelectedMaquinaria(value);
        setValue("maquinaria", value ? [value] : []);
    };

    const estadoOptions = [
        { label: "🧱 EN OBRA", value: "EN_OBRA" },
        { label: "✅ EN ALQUILER", value: "EN_ALQUILER" },
        { label: "🔄 EN CAMPAMENTO", value: "CAMPAMENTO" },
        { label: "⚙️ EN TALLER", value: "EN_TALLER" },
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

    // Función para obtener label de un valor (value)
    const getLabelFromValue = (value: string): string => {
        if (!value) return 'N/A';
        const canton = cantonOptions.find(opt => opt.value === value);
        return canton ? canton.label : value;
    };

    // Función para manejar arrays o strings
    const convertirValueALabel = (valor: string | string[]): string => {
        if (!valor) return 'N/A';
        
        if (Array.isArray(valor)) {
            return valor.map(v => getLabelFromValue(v)).join(', ');
        }
        
        return getLabelFromValue(valor);
    };

    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
            <Header title={isEditMode ? "EDITAR MOVIMIENTO" : "NUEVO MOVIMIENTO"} />
            
            <Panel 
                bordered 
                className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden"
                header={
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-2xl flex items-center gap-3">
                                {isEditMode ? "✏️ Editar Movimiento" : "➕ Registrar Nuevo Movimiento"}
                            </h3>
                            {isEditMode && movimiento && (
                                <Tag className="bg-white text-indigo-600 font-bold px-4 py-1 rounded-full">
                                    ID: {movimiento.movimientoNumber}
                                </Tag>
                            )}
                        </div>
                        <p className="text-indigo-100 mt-2">
                            {isEditMode 
                                ? "Actualice la información del movimiento existente" 
                                : "Complete todos los campos para registrar un nuevo movimiento"
                            }
                        </p>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(handleCreateOrUpdateMovimiento)}>
                    {/* Sección de Información Básica */}
                    <div className="p-6 border-b border-gray-200">
                        <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">⚙️</span>
                            Información Básica
                        </h4>
                        
                        <Row gutter={16}>
                            {/* Tipo de Maquinaria */}
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Maquinaria *
                                    </label>
                                    <Controller
                                        name="maquinaria"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <div>
                                                <SelectPicker
                                                    {...field}
                                                    data={
                                                        maquinariaData?.maquinarias?.map((maq) => ({
                                                            label: maq.type,
                                                            value: maq.type,
                                                        })) || []
                                                    }
                                                    className="w-full"
                                                    placeholder="Seleccione una máquina"
                                                    onChange={handleMaquinariaChange}
                                                    value={field.value?.[0] || null}
                                                    searchable={true}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </Col>
                            
                        </Row>

                        {/* SECCIÓN DE HISTORIAL - Solo se muestra si hay máquina seleccionada */}
                        {selectedMaquinaria && (
                            <div className="mt-6 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                {loadingHistorial || loadingMovimientos ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader size="sm" />
                                        <span className="ml-2 text-gray-600">Cargando histórico...</span>
                                    </div>
                                ) : historialMaquinaria.length > 0 ? (
                                    <>
                                        <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="text-blue-600">📋</span>
                                            Historial de Ubicaciones - {selectedMaquinaria}
                                        </h5>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            {/* Resumen del Historial */}
                                            <div className="bg-white p-4 rounded-lg border">
                                                <h6 className="font-bold text-gray-700 mb-2">📊 Resumen</h6>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Total movimientos:</span>
                                                        <Tag color="blue">{historialMaquinaria.length}</Tag>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Último movimiento:</span>
                                                        <span className="font-medium">
                                                            {new Date(historialMaquinaria[0].createdAt).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Origen frecuente:</span>
                                                        <span className="font-medium">
                                                            {getLugarMasFrecuente(historialMaquinaria, 'origen')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Destino frecuente:</span>
                                                        <span className="font-medium">
                                                            {getLugarMasFrecuente(historialMaquinaria, 'traslado')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Ubicaciones encontradas */}
                                            {/* <div className="bg-white p-4 rounded-lg border">
                                                <h6 className="font-bold text-gray-700 mb-2">📍 Ubicaciones Registradas</h6>
                                                {ubicacionesHistorial.length > 0 ? (
                                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                                        {ubicacionesHistorial.slice(0, 3).map((ubicacion, index) => (
                                                            <div key={ubicacion.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                <div>
                                                                    <span className="font-medium">{ubicacion.canton}</span>
                                                                    {ubicacion.provincia && (
                                                                        <span className="text-sm text-gray-500 ml-2">({ubicacion.provincia})</span>
                                                                    )}
                                                                </div>
                                                                <Tag size="sm" color="green">Ubicación</Tag>
                                                            </div>
                                                        ))}
                                                        {ubicacionesHistorial.length > 3 && (
                                                            <div className="text-center text-sm text-gray-500">
                                                                + {ubicacionesHistorial.length - 3} ubicaciones más...
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No se encontraron ubicaciones específicas</p>
                                                )}
                                            </div> */}
                                        </div>
                                        
                                        {/* Timeline de últimos movimientos */}
                                        <div className="mt-4">
                                            <h6 className="font-bold text-gray-700 mb-2">🕐 Últimos 3 Movimientos</h6>
                                            <div className="space-y-2">
                                                {historialMaquinaria.slice(0, 3).map((mov, index) => (
                                                    <div key={mov.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Tag color="green">
                                                                        MOVIMIENTO
                                                                        {mov.movimiento?.replace('_', ' ')}
                                                                    </Tag>                                                                    
                                                                    <span className="text-sm text-gray-500">
                                                                        {new Date(mov.createdAt).toLocaleDateString('es-ES')}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">De: </span>
                                                                    <span className="font-medium">
                                                                        {convertirValueALabel(mov.origen)}
                                                                    </span>
                                                                    <span className="mx-2 text-gray-400">→</span>
                                                                    <span className="text-gray-600">A: </span>
                                                                    <span className="font-medium">
                                                                        {convertirValueALabel(mov.traslado)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Tag size="sm" color="cyan">
                                                                Mov #{index + 1}
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="text-gray-400 text-3xl mb-2">📭</div>
                                        <p className="text-gray-600">
                                            No hay movimientos registrados para esta máquina
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Será el primer movimiento registrado
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <Row gutter={16} className="mt-4">
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Nombre Solicitante *
                                    </label>
                                    <Controller
                                        name="solicitante"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                className={`border-2 ${errors.solicitante ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.solicitante && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.solicitante.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Nombre del que Autoriza *
                                    </label>
                                    <Controller
                                        name="autoriza"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                className={`border-2 ${errors.autoriza ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.autoriza && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.autoriza.message}
                                        </div>
                                    )}
                                </div>
                            </Col>                            
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Lugar de Traslado *
                                    </label>
                                    <Controller
                                        name="traslado"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={cantonOptions}
                                                className="w-full"
                                                placeholder="Seleccione el cantón"
                                                searchable={true}
                                                onChange={(value) => field.onChange(value ? [value] : [])}
                                                value={Array.isArray(field.value) ? field.value[0] : field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Lugar de Origen *
                                    </label>
                                    <Controller
                                        name="origen"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={
                                                    ubicacionData?.ubicaciones?.map((ubicacion) => ({
                                                        label: ubicacion.canton,
                                                        value: ubicacion.canton,
                                                    })) || []
                                                }
                                                className="w-full"
                                                placeholder="Seleccione el origen"
                                                searchable={true}
                                                onChange={(value) => field.onChange(value ? [value] : [])}
                                                value={Array.isArray(field.value) ? field.value[0] : field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </Col> */}

                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Lugar de Origen *
                                    </label>
                                    <Controller
                                        name="origen"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <SelectPicker
                                                {...field}
                                                data={cantonOptions}
                                                className="w-full"
                                                placeholder="Seleccione el cantón"
                                                searchable={true}
                                                onChange={(value) => field.onChange(value ? [value] : [])}
                                                value={Array.isArray(field.value) ? field.value[0] : field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16} className="mt-4">
                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Fecha de Solicitud *
                                    </label>
                                    <Controller
                                        name="fechaS"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                type="date"
                                                className={`border-2 ${errors.fechaS ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.fechaS && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.fechaS.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col xs={24} md={12}>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 mb-2 block">
                                        Fecha de Traslado *
                                    </label>
                                    <Controller
                                        name="fechaT"
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                type="date"
                                                className={`border-2 ${errors.fechaT ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                                            />
                                        )}
                                    />
                                    {errors.fechaT && (
                                        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                            {errors.fechaT.message}
                                        </div>
                                    )}
                                </div>
                            </Col>                           
                        </Row>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                        <Button
                            type="button"
                            appearance="subtle"
                            onClick={closeDrawer}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                            disabled={createMovimientoLoading || updateMovimientoLoading}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            type="submit"
                            appearance="primary"
                            className="px-8 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            loading={createMovimientoLoading || updateMovimientoLoading}
                            disabled={!isDirty && isEditMode}
                        >
                            {isEditMode ? "Actualizar Movimiento" : "Crear Movimiento"}
                        </Button>
                    </div>
                </form>
            </Panel>

            {(createMovimientoLoading || updateMovimientoLoading) && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="text-center">
                        <Loader size="lg" />
                        <p className="mt-4 text-gray-600 font-medium">
                            {isEditMode ? "Actualizando movimiento..." : "Creando movimiento..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateOrUpdateMovimiento;