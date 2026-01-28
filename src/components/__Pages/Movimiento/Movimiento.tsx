import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { gqlMovimiento } from "gql";
import Header from "components/_Custom/Header/Header";
import { Col, Loader, Row, Input, Button, Panel, Tag, Badge, SelectPicker } from "rsuite";
import Table from "components/_Custom/Table/Table";
import Icon from "components/_Custom/Icon/Icon";
import useTranslation from "next-translate/useTranslation";
import { ButtonTooltipIcon } from "components/_Custom/Button/ButtonTooltipIcon";
import { IColumn } from "components/_Custom/Table/Table.types";
import { IMovimiento } from "types/Movimiento.type";
import { useModal } from "context/modal/modal.provider";
import { useDrawer } from "context/drawer/drawer.provider";
import moment from "moment";
import { useProfile } from "context/profile/profile.context";
import CreateOrUpdateMovimiento from "./Form/CreateOrUpdateMovimiento";
import DeleteMovimiento from "./DeleteMovimiento";

const Movimiento = () => {
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

    const { data: movimientoData, loading: movimientoLoading, refetch } = useQuery<{
        movimientos: IMovimiento[];
    }>(gqlMovimiento.queries.GET_MOVIMIENTO, {
        nextFetchPolicy: "network-only",
    });

    const tipoOptions = [
        { label: "Volqueta", value: "1", color: "orange", icon: "🚛" },
        { label: "Minicargadora", value: "2", color: "blue", icon: "🏗️" },
        { label: "Draga", value: "3", color: "cyan", icon: "⚙️" },
        { label: "Aplanadora o Compactadora", value: "4", color: "red", icon: "🏗️" },
        { label: "Excavadora", value: "5", color: "green", icon: "🔨" },
        { label: "Retroexcavadora", value: "6", color: "purple", icon: "⚙️" },
        { label: "Bulldozer", value: "7", color: "yellow", icon: "🏗️" },
        { label: "Grúa", value: "8", color: "gray", icon: "🏗️" },
        { label: "Pavimentadora", value: "9", color: "pink", icon: "🏗️" },
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

    const sortedMovimientos = movimientoData?.movimientos?.slice().sort((a, b) =>
        moment(b.createdAt).diff(moment(a.createdAt))
    );

    const handleNewMovimiento = () => {
        openDrawer({
            drawerComponent: <CreateOrUpdateMovimiento />,
        });
    };

    const handleDeleteMovimiento = (movimiento: IMovimiento) => {
        openModal({
            backdrop: "static",
            modalComponent: <DeleteMovimiento movimiento={movimiento}/>,
        });
    };

    const handleEditMovimiento = (movimiento: IMovimiento) => {
        openDrawer({
            drawerComponent: <CreateOrUpdateMovimiento movimiento={movimiento} />
        });
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleExport = () => {
        // Lógica para exportar datos
        console.log("Exportando datos...");
    };

    const filteredData = sortedMovimientos?.filter((item) => {
        const searchMatch = searchReport 
            ? item.solicitante.toLowerCase().includes(searchReport.toLowerCase()) ||
              item.movimientoNumber?.toLowerCase().includes(searchReport.toLowerCase()) ||
              item.autoriza?.toLowerCase().includes(searchReport.toLowerCase()) ||
              getTipoLabel(item.traslado[0]).toLowerCase().includes(searchReport.toLowerCase())
            : true;
        
        const typeMatch = filterType 
            ? item.solicitante === filterType
            : true;

        return searchMatch && typeMatch;
    });

    const columns: IColumn<IMovimiento>[] = [
        {
            dataKey: "movimientoNumber",
            header: "# Identificación",
            sortable: true,
            width: 140,
            customCell: ({ rowData }) => (
                <Tag color="blue" className="font-bold">
                    {rowData.movimientoNumber || "N/A"}
                </Tag>
            ),
        },
        {
            dataKey: "maquinaria",
            header: "Maquinaria",
            sortable: true,
            width: 170,
            customCell: ({ rowData }) => {
                // Verificar si maquinaria existe y tiene contenido
                if (!rowData.maquinaria || 
                    !Array.isArray(rowData.maquinaria) || 
                    rowData.maquinaria.length === 0 ||
                    !rowData.maquinaria[0]) {
                    return (
                        <span className="text-gray-400 italic text-sm">
                            No asignado
                        </span>
                    );
                }

                const maquinariaValue = rowData.maquinaria[0];
                const color = getTipoColor(maquinariaValue);
                
                return (
                    <div 
                        className={`rounded-full px-3 py-1 flex items-center`}
                    >
                        {getTipoLabel(maquinariaValue)}
                    </div>
                );
            },
        },
        {
            dataKey: "autoriza",
            header: "Autoriza",
            sortable: true,
            width: 120,
            customCell: ({ rowData }) => (
                <span className="font-medium">{rowData.autoriza || "N/A"}</span>
            ),
        },
        {
            dataKey: "solicitante",
            header: "Solicitante",
            sortable: true,
            width: 120,
            customCell: ({ rowData }) => (
                <span className="font-medium">{rowData.solicitante || "N/A"}</span>
            ),
        },
        {
            dataKey: "movimiento",
            header: "Estado de Movimiento",
            sortable: true,
            width: 120,
            customCell: ({ rowData }) => (
                <span className="font-medium">{rowData.movimiento || "N/A"}</span>
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
                        onClick={() => handleEditMovimiento(rowData)}
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
                        onClick={() => handleDeleteMovimiento(rowData)}
                    />
                </div>
            ),
        },
    ];

    const stats = {
        total: filteredData?.length || 0,
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
                                Control de Movimientos
                            </h1>
                            <p className="text-blue-100 mt-2">
                                Gestione y supervise los movimientos de maquinaria
                            </p>
                        </div>
                        <Button
                            appearance="primary"
                            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={handleNewMovimiento}
                        >
                            <span className="mr-2">➕</span>
                            Nuevo Movimiento
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Movimientos</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <span className="text-blue-600 text-xl">📑</span>
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
                                    placeholder="Buscar por solicitante, número, autorización..."
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
                                    Listado de Movimientos
                                    {filteredData && (
                                        <span className="ml-2 text-sm font-normal text-gray-600">
                                            ({filteredData.length} registros)
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {movimientoLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader size="lg" />
                                    <p className="mt-4 text-gray-600">Cargando movimientos...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredData && filteredData.length > 0 ? (
                                        <Table<IMovimiento>
                                            data={filteredData}
                                            columns={columns}
                                            className="border-0 bg-gray-50 text-gray-700 font-bold"
                                            rowClassName="hover:bg-blue-50 transition-colors"
                                        />
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                                                <span className="text-gray-400 text-4xl">🚛</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                                No se encontraron movimientos
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                {searchReport || filterType 
                                                    ? "No hay resultados que coincidan con los filtros aplicados."
                                                    : "No hay movimientos registrados todavía."}
                                            </p>
                                            {!searchReport && !filterType && (
                                                <Button
                                                    appearance="primary"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={handleNewMovimiento}
                                                >
                                                    <span className="mr-2">➕</span>
                                                    Registrar Primer Movimiento
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
                        Sistema de Control de Movimientos • Total registros: {stats.total} • Última actualización: {moment().format("DD/MM/YYYY HH:mm")}
                    </p>
                </div>
            </Panel>
        </div>
    );
};

export default Movimiento;