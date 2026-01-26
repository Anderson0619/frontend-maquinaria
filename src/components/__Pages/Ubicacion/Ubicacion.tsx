import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { gqlUbicacion } from "gql";
import Header from "components/_Custom/Header/Header";
import { Col, Loader, Row, Input, Button, Panel, Tag, Badge, SelectPicker } from "rsuite";
import Table from "components/_Custom/Table/Table";
import Icon from "components/_Custom/Icon/Icon";
import useTranslation from "next-translate/useTranslation";
import { ButtonTooltipIcon } from "components/_Custom/Button/ButtonTooltipIcon";
import { IColumn } from "components/_Custom/Table/Table.types";
import { IUbicacion } from "types/Ubicacion.type";
import { useModal } from "context/modal/modal.provider";
import { useDrawer } from "context/drawer/drawer.provider";
import moment from "moment";
import { useProfile } from "context/profile/profile.context";
import CreateOrUpdateUbicacion from "./Form/CreateOrUpdateUbicacion";
import DeleteUbicacion from "./DeleteUbicacion";

const Ubicacion = () => {
    const { t } = useTranslation("common");

    const { openDrawer } = useDrawer();
    const { openModal } = useModal();

    const { user } = useProfile();
    
    const [searchReport, setSearchReport] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);

    const handleSearchChange = (value: string) => {
        setSearchReport(value);
    };

    const handleFilterChange = (value: string | null) => {
        setFilterType(value);
    };

    const { data: ubicacionData, loading: ubicacionLoading, refetch } = useQuery<{
        ubicaciones: IUbicacion[];
    }>(gqlUbicacion.queries.GET_UBICACIONES, {
        nextFetchPolicy: "network-only",
    });

    const tipoOptions = [
        { label: "Tipo 1", value: "1", color: "orange", icon: "🚛" },
        { label: "Tipo 2", value: "2", color: "blue", icon: "🏗️" },
        { label: "Tipo 3", value: "3", color: "cyan", icon: "⚙️" },
        { label: "Tipo 4", value: "4", color: "red", icon: "🏗️" },
    ];

    // Función para obtener el label del tipo basado en el value
    const getTipoLabel = (value: string) => {
        const tipo = tipoOptions.find(opt => opt.value === value);
        return tipo?.label || value;
    };

    // Función para obtener el color del tipo
    const getTipoColor = (value: string) => {
        const tipo = tipoOptions.find(opt => opt.value === value);
        return tipo?.color || "gray";
    };

    // Función para obtener el icono del tipo
    const getTipoIcon = (value: string) => {
        const tipo = tipoOptions.find(opt => opt.value === value);
        return tipo?.icon || "⚙️";
    };

    const sortedOrdens = ubicacionData?.ubicaciones?.slice().sort((a, b) =>
        moment(b.createdAt).diff(moment(a.createdAt))
    );

    const handleNewUbicacion = () => {
        openDrawer({
            drawerComponent: <CreateOrUpdateUbicacion />,
        });
    };

    const handleDeleteUbicacion = (ubicacion: IUbicacion) => {
        openModal({
            backdrop: "static",
            modalComponent: <DeleteUbicacion ubicacion={ubicacion}/>,
        });
    };

    const handleEditUbicacion = (ubicacion: IUbicacion) => {
        openDrawer({
            drawerComponent: <CreateOrUpdateUbicacion ubicacion={ubicacion} />
        });
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleExport = () => {
        // Lógica para exportar datos
        console.log("Exportando datos...");
    };

    const filteredData = sortedOrdens?.filter((item) => {
        const searchMatch = searchReport 
            ? item.type.toLowerCase().includes(searchReport.toLowerCase()) ||
              item.ubiNumber?.toLowerCase().includes(searchReport.toLowerCase()) ||
              item.encargado?.toLowerCase().includes(searchReport.toLowerCase()) ||
              item.ubicacion?.toLowerCase().includes(searchReport.toLowerCase()) ||
              getTipoLabel(item.type).toLowerCase().includes(searchReport.toLowerCase())
            : true;
        
        const typeMatch = filterType 
            ? item.type === filterType
            : true;

        return searchMatch && typeMatch;
    });


    const columns: IColumn<IUbicacion>[] = [
        {
            dataKey: "ubiNumber",
            header: "# Identificación",
            sortable: true,
            width: 140,
            customCell: ({ rowData }) => (
                <Tag color="blue" className="font-bold">
                    {rowData.ubiNumber || "N/A"}
                </Tag>
            ),
        },
        {
            dataKey: "type",
            header: "Tipo",
            sortable: true,
            width: 170,
            customCell: ({ rowData }) => {
                const color = getTipoColor(rowData.type);
                const icon = getTipoIcon(rowData.type);
                const label = getTipoLabel(rowData.type);
                
                return (
                    <Badge 
                        className={`bg-${color}-100 text-${color}-800 border border-${color}-200 rounded-full px-3 py-1 flex items-center`}
                    >
                        <span className="mr-2">{icon}</span>
                        {label}
                    </Badge>
                );
            },
        },
        {
            dataKey: "ubicacion",
            header: "Ubicación",
            sortable: true,
            width: 120,
            customCell: ({ rowData }) => {
                const value = rowData.ubicacion || rowData.type || "";
                const color = getTipoColor(value);
                const icon = getTipoIcon(value);
                const label = getTipoLabel(value);
                
                return (
                    <Badge 
                        className={`bg-${color}-100 text-${color}-800 border border-${color}-200 rounded-full px-3 py-1 flex items-center`}
                    >
                        <span className="mr-2">{icon}</span>
                        {label}
                    </Badge>
                );
            },
        },
        {
            dataKey: "encargado",
            header: "Encargado",
            sortable: true,
            width: 120,
            customCell: ({ rowData }) => (
                <span className="text-gray-600">{rowData.encargado || "N/A"}</span>
            ),
        },
        {
            dataKey: "createdAt",
            header: "Fecha Creación",
            sortable: true,
            width: 140,
            customCell: ({ rowData }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{moment(rowData.createdAt).format("DD/MM/YYYY")}</span>
                    <span className="text-xs text-gray-500">{moment(rowData.createdAt).format("HH:mm")}</span>
                </div>
            ),
        },/* 
        {
            dataKey: "description",
            header: "Descripción",
            width: 200,
            customCell: ({ rowData }) => (
                <div className="truncate max-w-xs" title={rowData.description}>
                    {rowData.description ? (
                        rowData.description.length > 50 
                            ? `${rowData.description.substring(0, 50)}...`
                            : rowData.description
                    ) : "Sin descripción"}
                </div>
            ),
        }, */
        {
            dataKey: "id",
            header: "Acciones",
            width: 140,
            customCell: ({ rowData }) => (
                <div className="flex items-center space-x-2">
                    <ButtonTooltipIcon 
                        appearance="ghost"
                        color="blue"
                        icon={<Icon icon="edit" />}
                        info="Editar"
                        showIcon
                        placement="top"
                        trigger="hover"
                        className="hover:bg-blue-50"
                        onClick={() => handleEditUbicacion(rowData)}
                    />
                    <ButtonTooltipIcon 
                        appearance="ghost"
                        color="red"
                        icon={<Icon icon="trash" />}
                        info="Eliminar"
                        showIcon
                        placement="top"
                        trigger="hover"
                        className="hover:bg-red-50"
                        onClick={() => handleDeleteUbicacion(rowData)}
                    />
                </div>
            ),
        },
    ];

    const stats = {
        total: filteredData?.length || 0,
        encargado: new Set(filteredData?.map(item => item.encargado)).size || 0,
    };

    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            <Panel 
                bordered 
                className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden mb-6"
            >
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                                <span className="text-white">🚛</span>
                                Control de Ubicaciones
                            </h1>
                            <p className="text-blue-100 mt-2">
                                Gestione y supervise el inventario de ubicaciones
                            </p>
                        </div>
                        <Button
                            appearance="primary"
                            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={handleNewUbicacion}
                        >
                            <span className="mr-2">➕</span>
                            Nueva Ubicación
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Ubicaciones</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <span className="text-blue-600 text-xl">📍</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Encargados</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.encargado}</h3>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <span className="text-orange-600 text-xl">👤</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                                <Input 
                                    placeholder="Buscar por tipo, ubicacion, encargado..."
                                    value={searchReport}
                                    onChange={(value) => handleSearchChange(value)}
                                    className="pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>
                        
                        <div className="w-full md:w-64">
                            <div className="flex items-center">
                                <span className="mr-2 text-gray-400">⚙️</span>
                                <SelectPicker
                                    data={tipoOptions.map(opt => ({
                                        label: (
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    {opt.icon}
                                                </span>
                                                {opt.label}
                                            </div>
                                        ),
                                        value: opt.value
                                    }))}
                                    value={filterType}
                                    onChange={handleFilterChange}
                                    placeholder="Filtrar por tipo"
                                    cleanable
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                appearance="ghost"
                                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={handleRefresh}
                            >
                                <Icon icon="refresh" className="mr-2" />
                                Actualizar
                            </Button>
                            
                            {/* <Button
                                appearance="primary"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleExport}
                                disabled={!filteredData || filteredData.length === 0}
                            >
                                <Icon icon="download" className="mr-2" />
                                Exportar
                            </Button> */}
                        </div>
                    </div>

                    {/* Info de filtros */}
                    {(searchReport || filterType) && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-sm text-blue-700">
                                        Filtros aplicados: 
                                        {searchReport && <span className="ml-2 bg-white px-2 py-1 rounded border">Búsqueda: "{searchReport}"</span>}
                                        {filterType && (
                                            <span className="ml-2 bg-white px-2 py-1 rounded border flex items-center">
                                                <span className="mr-1">
                                                    {getTipoIcon(filterType)}
                                                </span>
                                                Tipo: {getTipoLabel(filterType)}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <Button
                                    size="xs"
                                    appearance="ghost"
                                    className="text-blue-700 hover:text-blue-800"
                                    onClick={() => {
                                        setSearchReport("");
                                        setFilterType(null);
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla */}
                <div className="p-6">
                    <Row>
                        <Col xs={24} className="mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Listado de Ubicaciones
                                    {filteredData && (
                                        <span className="ml-2 text-sm font-normal text-gray-600">
                                            ({filteredData.length} registros)
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {ubicacionLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader size="lg" />
                                    <p className="mt-4 text-gray-600">Cargando ubicaciones...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredData && filteredData.length > 0 ? (
                                        <Table<IUbicacion>
                                            data={filteredData}
                                            columns={columns}
                                            className="border-0 bg-gray-50 text-gray-700 font-bold"
                                            rowClassName="hover:bg-blue-50 transition-colors"
                                        />
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                                                <span className="text-gray-400 text-4xl">📍</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                                No se encontraron ubicaciones
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                {searchReport || filterType 
                                                    ? "No hay resultados que coincidan con los filtros aplicados."
                                                    : "No hay ubicaciones registradas todavía."}
                                            </p>
                                            {!searchReport && !filterType && (
                                                <Button
                                                    appearance="primary"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={handleNewUbicacion}
                                                >
                                                    <span className="mr-2">➕</span>
                                                    Registrar Primera Ubicacion
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                        Sistema de Control de Maquinaria • Total registros: {stats.total} • Última actualización: {moment().format("DD/MM/YYYY HH:mm")}
                    </p>
                </div>
            </Panel>
        </div>
    );
};

export default Ubicacion;