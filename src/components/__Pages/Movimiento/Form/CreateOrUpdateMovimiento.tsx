import { useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlMovimiento, gqlMaquinaria, gqlUbicacion } from "gql";
import {
  ICreateMovimientoInput,
  ICreateMovimientoResponse,
  IUpdateMovimientoInput,
} from "gql/Movimiento/mutations";
import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Col,
  Input,
  Row,
  SelectPicker,
  Panel,
  Loader,
  Tag,
} from "rsuite";
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
    movimiento?.maquinaria?.[0] || null,
  );
  const [historialMaquinaria, setHistorialMaquinaria] = useState<IMovimiento[]>(
    [],
  );
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [selectedMaquinariaInfo, setSelectedMaquinariaInfo] =
    useState<IMaquinaria | null>(null);
  const [detallesCompletos, setDetallesCompletos] = useState<string>("");

  const { data: allMovimientosData, loading: loadingMovimientos } = useQuery<{
    movimientos: IMovimiento[];
  }>(gqlMovimiento.queries.GET_MOVIMIENTO, {
    fetchPolicy: "network-only",
  });

  const { data: maquinariaData } = useQuery<{ maquinarias: IMaquinaria[] }>(
    gqlMaquinaria.queries.GET_MAQUINARIA,
  );
  const { data: ubicacionData } = useQuery<{ ubicaciones: IUbicacion[] }>(
    gqlUbicacion.queries.GET_UBICACIONES,
    {
      fetchPolicy: "network-only",
    },
  );

  // Cargar historial cuando cambia la máquina seleccionada
  useEffect(() => {
    if (selectedMaquinaria && allMovimientosData?.movimientos) {
      setLoadingHistorial(true);

      // Filtrar movimientos de esta máquina
      const historial = allMovimientosData.movimientos.filter((mov) => {
        if (Array.isArray(mov.maquinaria)) {
          return mov.maquinaria.includes(selectedMaquinaria);
        } else if (typeof mov.maquinaria === "string") {
          return mov.maquinaria === selectedMaquinaria;
        }
        return false;
      });

      // Ordenar por fecha (más reciente primero)
      const historialOrdenado = historial.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setHistorialMaquinaria(historialOrdenado);
      setLoadingHistorial(false);
    } else {
      setHistorialMaquinaria([]);
    }
  }, [selectedMaquinaria, allMovimientosData]);

  // Buscar información de la máquina seleccionada
  useEffect(() => {
    if (selectedMaquinaria && maquinariaData?.maquinarias) {
      const maquinaSeleccionada = maquinariaData.maquinarias.find(
        (m) => m.maquiNumber === selectedMaquinaria,
      );
      setSelectedMaquinariaInfo(maquinaSeleccionada || null);
      
      if (maquinaSeleccionada) {
        const detalles = generarDetallesCompletos(maquinaSeleccionada);
        setDetallesCompletos(detalles);
        setValue("movimiento", generarResumenCorto(maquinaSeleccionada), { shouldValidate: true });
      }
    }
  }, [selectedMaquinaria, maquinariaData]);

  // Función para obtener el último destino
  const obtenerUltimoDestino = (): string => {
    if (historialMaquinaria.length === 0) {
      // Buscar si hay una ubicación de tipo "Taller"
      const tallerUbicacion = ubicacionData?.ubicaciones?.find(
        (u) => u.type?.toLowerCase().includes("taller")
      );
      return tallerUbicacion?.ubicacion || "Taller";
    }
    
    // Obtener el último movimiento
    const ultimoMovimiento = historialMaquinaria[0];
    
    let ultimoDestino = "";
    
    if (Array.isArray(ultimoMovimiento.traslado)) {
      ultimoDestino = ultimoMovimiento.traslado[0] || "";
    } else if (ultimoMovimiento.traslado) {
      ultimoDestino = ultimoMovimiento.traslado;
    }
    
    return ultimoDestino || "Taller";
  };

  // Autocompletar origen cuando cambia el historial
  useEffect(() => {
    if (selectedMaquinaria && !isEditMode) {
      const ultimoDestino = obtenerUltimoDestino();
      setValue("origen", [ultimoDestino], { shouldValidate: true });
    }
  }, [historialMaquinaria, selectedMaquinaria, isEditMode]);

  // Función para obtener lugar más frecuente
  const getLugarMasFrecuente = (
    movimientos: IMovimiento[],
    tipo: "origen" | "traslado"
  ) => {
    const lugares = new Map<string, number>();

    movimientos.forEach((mov) => {
      let lugarValue = "";
      if (Array.isArray(mov[tipo])) {
        lugarValue = mov[tipo][0] || "";
      } else {
        lugarValue = mov[tipo] || "";
      }

      if (lugarValue) {
        lugares.set(lugarValue, (lugares.get(lugarValue) || 0) + 1);
      }
    });

    let maxCount = 0;
    let lugarMasFrecuenteValue = "";

    lugares.forEach((count, lugarValue) => {
      if (count > maxCount) {
        maxCount = count;
        lugarMasFrecuenteValue = lugarValue;
      }
    });

    return lugarMasFrecuenteValue || "N/A";
  };

  // Mutaciones
  const [createMovimiento, { loading: createMovimientoLoading }] =
    useMutation<ICreateMovimientoResponse>(
      gqlMovimiento.mutations.CREATE_MOVIMIENTO,
      {
        update: (cache, { data }) => {
          if (data?.createMovimiento) {
            const { movimientos } = cache.readQuery<{
              movimientos: IMovimiento[];
            }>({
              query: gqlMovimiento.queries.GET_MOVIMIENTO,
            }) || { movimientos: [] };

            cache.writeQuery({
              query: gqlMovimiento.queries.GET_MOVIMIENTO,
              data: {
                movimientos: [...movimientos, data.createMovimiento],
              },
            });
          }
        },
      },
    );

  const [updateMovimiento, { loading: updateMovimientoLoading }] = useMutation<
    IUpdateMovimientoInput,
    { updateMovimientoInput: IUpdateMovimientoInput }
  >(gqlMovimiento.mutations.UPDATE_MOVIMIENTO, {
    update: (cache, { data }) => {
      if (data) {
        const { movimientos } = cache.readQuery<{ movimientos: IMovimiento[] }>(
          {
            query: gqlMovimiento.queries.GET_MOVIMIENTO,
          },
        ) || { movimientos: [] };

        const updatedMovimientos = movimientos.map((item) =>
          item.id === movimiento?.id ? { ...item, ...data } : item,
        );

        cache.writeQuery({
          query: gqlMovimiento.queries.GET_MOVIMIENTO,
          data: { movimientos: updatedMovimientos },
        });
      }
    },
  });

  // Función para enviar formulario
  const handleCreateOrUpdateMovimiento = async (
    formData: ICreateMovimientoInput,
  ) => {
    try {
      // Asegurar que los detalles completos se envíen
      const dataToSend = {
        ...formData,
        movimiento: detallesCompletos, // Enviamos los detalles completos
      };

      if (isEditMode && movimiento) {
        await updateMovimiento({
          variables: {
            updateMovimientoInput: {
              id: movimiento.id,
              ...dataToSend,
            },
          },
        });
        toast.success("✅ Movimiento actualizado exitosamente");
      } else {
        await createMovimiento({
          variables: {
            createMovimientoInput: dataToSend,
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

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    trigger
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
    mode: "onChange",
  });

  // Funciones auxiliares
  const generarResumenCorto = (maquinaria: IMaquinaria): string => {
    return `${maquinaria.maquiNumber} - ${maquinaria.type} (${maquinaria.mark} ${maquinaria.model})`;
  };

  const generarDetallesCompletos = (maquinaria: IMaquinaria): string => {
    const detalles = [];

    detalles.push(`Número: ${maquinaria.maquiNumber}`);
    detalles.push(`Tipo: ${maquinaria.type}`);
    if (maquinaria.mark) detalles.push(`Marca: ${maquinaria.mark}`);
    if (maquinaria.model) detalles.push(`Modelo: ${maquinaria.model}`);
    if (maquinaria.anio) detalles.push(`Año: ${maquinaria.anio}`);
    if (maquinaria.estado) detalles.push(`Estado: ${maquinaria.estado}`);
    if (maquinaria.location) detalles.push(`Ubicación: ${maquinaria.location}`);

    return detalles.join(" | ");
  };

  const handleMaquinariaChange = (value: string | null) => {
    setSelectedMaquinaria(value);
    setValue("maquinaria", value ? [value] : []);
  };

  // Función para convertir valores a labels
  const convertirValueALabel = (valor: string | string[]): string => {
    if (!valor) return "N/A";

    if (Array.isArray(valor)) {
      return valor
        .map((v) => {
          if (!v) return "N/A";
          const ubicacion = ubicacionData?.ubicaciones?.find(u => u.ubicacion === v);
          return ubicacion 
            ? `${ubicacion.ubicacion}${ubicacion.canton ? ` (${ubicacion.canton})` : ''}`
            : v;
        })
        .join(", ");
    }

    const ubicacion = ubicacionData?.ubicaciones?.find(u => u.ubicacion === valor);
    return ubicacion 
      ? `${ubicacion.ubicacion}${ubicacion.canton ? ` (${ubicacion.canton})` : ''}`
      : valor;
  };

  // Función para validar que la fecha de traslado sea igual o posterior a la de solicitud
const validateFechaTraslado = (fechaT: string) => {
    const fechaS = watch("fechaS");
    
    if (!fechaS || !fechaT) return true; // Si no hay fechas, no validar
    
    const fechaSolicitud = new Date(fechaS);
    const fechaTraslado = new Date(fechaT);
    
    // Validar que la fecha de traslado sea igual o posterior
    if (fechaTraslado < fechaSolicitud) {
        return "La fecha de traslado debe ser igual o posterior a la fecha de solicitud";
    }
    
    return true;
};

const validateFechaSolicitud = (fechaS: string) => {
    const fechaT = watch("fechaT");
    
    if (!fechaS || !fechaT) return true;
    
    const fechaSolicitud = new Date(fechaS);
    const fechaTraslado = new Date(fechaT);
    
    if (fechaTraslado < fechaSolicitud) {
        return "La fecha de solicitud debe ser anterior o igual a la fecha de traslado";
    }
    
    return true;
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
                {isEditMode
                  ? "✏️ Editar Movimiento"
                  : "➕ Registrar Nuevo Movimiento"}
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
                : "Complete todos los campos para registrar un nuevo movimiento"}
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit(handleCreateOrUpdateMovimiento)}>
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-bold text-gray-700 text-lg mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                ⚙️
              </span>
              Información Básica
            </h4>

            <Row gutter={16}>
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
                              label: `${maq.maquiNumber} - ${maq.type}`,
                              value: maq.maquiNumber,
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
              
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <label className="font-bold text-gray-700 mb-2 block">
                    Detalles de la Máquina *
                  </label>
                  <Controller
                    name="movimiento"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          value={field.value || ""}
                          readOnly
                          className="border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed transition-all pr-10"
                          placeholder="Seleccione una máquina primero..."
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          📋
                        </div>
                      </div>
                    )}
                  />
                  
                  {selectedMaquinariaInfo && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-700 space-y-1">
                        <div className="font-medium mb-1">Detalles que se guardarán:</div>
                        {detallesCompletos.split(" | ").map((detalle, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{detalle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Historial de la máquina */}
            {selectedMaquinaria && (
              <div className="mt-6 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                {loadingHistorial ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader size="sm" />
                    <span className="ml-2 text-gray-600">
                      Cargando histórico...
                    </span>
                  </div>
                ) : historialMaquinaria.length > 0 ? (
                  <>
                    <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">📋</span>
                      Historial de Ubicaciones - {selectedMaquinaria}
                      <Tag color="blue" className="ml-2">
                        {historialMaquinaria.length} movimientos
                      </Tag>
                    </h5>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h6 className="font-bold text-gray-700 mb-2">📊 Resumen</h6>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Origen actual:</span>
                            <span className="font-medium">
                              {convertirValueALabel(watch("origen"))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Origen frecuente:</span>
                            <span className="font-medium">
                              {getLugarMasFrecuente(historialMaquinaria, "origen")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Destino frecuente:</span>
                            <span className="font-medium">
                              {getLugarMasFrecuente(historialMaquinaria, "traslado")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-bold text-gray-700 mb-2">
                          🕐 Últimos Movimientos
                        </h6>
                        <div className="space-y-2">
                          {historialMaquinaria.slice(0, 5).map((mov, index) => (
                            <div
                              key={mov.id}
                              className="bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-500">
                                      {new Date(mov.createdAt).toLocaleDateString("es-ES")}
                                    </span>
                                    <Tag size="sm" color="cyan">
                                      Mov #{historialMaquinaria.length - index}
                                    </Tag>
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
                              </div>
                            </div>
                          ))}
                        </div>
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
                        className={`border-2 ${
                          errors.solicitante
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
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
                        className={`border-2 ${
                          errors.autoriza ? "border-red-500" : "border-gray-300"
                        } rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
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

            {/* Ubicaciones - CORREGIDO */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-gray-700">
                      Lugar de Origen *
                    </label>
                    {selectedMaquinaria && (
                      <Tag size="sm" color={historialMaquinaria.length === 0 ? "orange" : "blue"}>
                        {historialMaquinaria.length === 0 ? "📍 Primera vez" : "🔄 Automático"}
                      </Tag>
                    )}
                  </div>
                  <Controller
                    name="origen"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <SelectPicker
                        {...field}
                        data={
                          ubicacionData?.ubicaciones?.map((ubicacion) => ({
                            label: `${ubicacion.ubicacion}${ubicacion.canton ? ` (${ubicacion.canton})` : ''}`,
                            value: ubicacion.ubicacion,
                          })) || []
                        }
                        className="w-full"
                        placeholder="Seleccione el origen"
                        searchable={true}
                        onChange={(value) => field.onChange(value ? [value] : [])}
                        value={Array.isArray(field.value) ? field.value[0] : field.value}
                        disabled={!selectedMaquinaria}
                      />
                    )}
                  />
                </div>
              </Col>
              
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
                        data={
                          ubicacionData?.ubicaciones?.map((ubicacion) => ({
                            label: `${ubicacion.ubicacion}${ubicacion.canton ? ` (${ubicacion.canton})` : ''}`,
                            value: ubicacion.ubicacion,
                          })) || []
                        }
                        className="w-full"
                        placeholder="Seleccione el destino"
                        searchable={true}
                        onChange={(value) => field.onChange(value ? [value] : [])}
                        value={Array.isArray(field.value) ? field.value[0] : field.value}
                        disabled={!selectedMaquinaria}
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
                rules={{ 
                    required: "Este campo es requerido",
                    validate: validateFechaSolicitud
                }}
                render={({ field }) => (
                    <div className="relative">
                        <Input
                            {...field}
                            type="date"
                            className={`border-2 ${
                                errors.fechaS ? "border-red-500" : "border-gray-300"
                            } rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                            max={watch("fechaT") || undefined} // Limitar fecha máxima
                            onChange={(value) => {
                                field.onChange(value);
                                // Trigger validación de fechaT cuando cambia fechaS
                                if (watch("fechaT")) {
                                    trigger("fechaT");
                                }
                            }}
                        />
                        {watch("fechaS") && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                📅
                            </div>
                        )}
                    </div>
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
                {watch("fechaS") && (
                    <span className="ml-2 text-sm text-gray-500">
                        (Mínimo: {watch("fechaS")})
                    </span>
                )}
            </label>
            <Controller
                name="fechaT"
                control={control}
                rules={{ 
                    required: "Este campo es requerido",
                    validate: validateFechaTraslado
                }}
                render={({ field }) => (
                    <div className="relative">
                        <Input
                            {...field}
                            type="date"
                            min={watch("fechaS") || undefined} // Establecer fecha mínima
                            className={`border-2 ${
                                errors.fechaT ? "border-red-500" : "border-gray-300"
                            } rounded-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                            onChange={(value) => {
                                field.onChange(value);
                                // Trigger validación de fechaS cuando cambia fechaT
                                if (watch("fechaS")) {
                                    trigger("fechaS");
                                }
                            }}
                        />
                        {watch("fechaT") && !errors.fechaT && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                ✅
                            </div>
                        )}
                    </div>
                )}
            />
            {errors.fechaT && (
                <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                    {errors.fechaT.message}
                </div>
            )}
            
            {/* Información adicional */}
            {watch("fechaS") && watch("fechaT") && !errors.fechaT && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">✓ Fechas válidas</span>
                        <span className="text-xs">
                            Diferencia: {
                                Math.ceil(
                                    (new Date(watch("fechaT")).getTime() - 
                                     new Date(watch("fechaS")).getTime()) / 
                                    (1000 * 60 * 60 * 24)
                                )
                            } días
                        </span>
                    </div>
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
              {isEditMode
                ? "Actualizando movimiento..."
                : "Creando movimiento..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrUpdateMovimiento;