import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { gqlMovimiento, gqlMaquinaria } from "gql";
import { 
    Row, Col, Panel, Button, Input, SelectPicker, Tag, Badge, Loader, 
    DateRangePicker, Dropdown, IconButton, Progress, Grid, 
    Stack, Divider, Pagination 
} from "rsuite";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { IMovimiento } from "types/Movimiento.type";
import { IMaquinaria } from "types/Maquinaria.type";
import moment from "moment";
import Icon from "components/_Custom/Icon/Icon";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useProfile } from "context/profile/profile.context";

const MovimientoDashboard = () => {
    const { user } = useProfile();
    
    // Estados para filtros
    const [searchText, setSearchText] = useState("");
    const [selectedMaquinaria, setSelectedMaquinaria] = useState<string | null>(null);
    const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Queries
    const { data: movimientosData, loading: loadingMovimientos } = useQuery<{ movimientos: IMovimiento[] }>(
        gqlMovimiento.queries.GET_MOVIMIENTO,
        {
            fetchPolicy: "network-only"
        }
    );
    
    const { data: maquinariaData } = useQuery<{ maquinarias: IMaquinaria[] }>(gqlMaquinaria.queries.GET_MAQUINARIA);

    // Opciones de filtros
    const estadoOptions = [
        { label: "✅ Activo", value: "ACTIVO" },
        { label: "⏸️ En Traslado", value: "EN_TRASLADO" },
        { label: "🏁 Finalizado", value: "FINALIZADO" },
        { label: "❌ Cancelado", value: "CANCELADO" },
    ];
    
    const maquinariaOptions = useMemo(() => {
        return maquinariaData?.maquinarias?.map(maq => ({
            label: `${maq.type} - ${maq.mark || ''}`,
            value: maq.id,
            //icon: getMaquinariaIcon(maq.type)
        })) || [];
    }, [maquinariaData]);
    
    // Función para obtener icono según tipo de maquinaria
    const getMaquinariaIcon = (type: string) => {
        switch(type.toLowerCase()) {
            case 'volqueta': return '🚛';
            case 'excavadora': return '🔨';
            case 'draga': return '⚙️';
            case 'minicargadora': return '🏗️';
            case 'grúa': return '🏗️';
            default: return '🚜';
        }
    };
    
    // Filtrar datos
    // Filtrar datos CORREGIDO
const filteredData = useMemo(() => {
    if (!movimientosData?.movimientos) return [];
    
    return movimientosData.movimientos.filter(mov => {
        // Filtro por texto de búsqueda
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            const matchesSearch = 
                (mov.movimientoNumber?.toLowerCase() || '').includes(searchLower) ||
                (mov.solicitante?.toLowerCase() || '').includes(searchLower) ||
                (mov.autoriza?.toLowerCase() || '').includes(searchLower) ||
                (mov.maquinaria?.toString().toLowerCase() || '').includes(searchLower) ||
                (Array.isArray(mov.origen) ? mov.origen.join(' ').toLowerCase() : (mov.origen || '')).includes(searchLower) ||
                (Array.isArray(mov.traslado) ? mov.traslado.join(' ').toLowerCase() : (mov.traslado || '')).includes(searchLower);
            
            if (!matchesSearch) return false;
        }
        
        // Filtro por maquinaria - VERIFICACIÓN MEJORADA
        if (selectedMaquinaria) {   
            const maquinariaId = selectedMaquinaria; // Esto es un ID de maquinaria
            const maqEncontrada = maquinariaData?.maquinarias?.find(m => m.id === maquinariaId);
            
            if (maqEncontrada) {
                // Verificar si el movimiento tiene esta maquinaria por ID o tipo
                const tieneMaquinaria = 
                    (Array.isArray(mov.maquinaria) && mov.maquinaria.includes(maqEncontrada.id)) ||
                    (typeof mov.maquinaria === 'string' && mov.maquinaria === maqEncontrada.id) ||
                    (typeof mov.maquinaria === 'string' && mov.maquinaria === maqEncontrada.type);
                
                if (!tieneMaquinaria) return false;
            }
        }
        
        // Filtro por estado - VERIFICACIÓN MEJORADA
        if (selectedEstado) {
            if (mov.movimiento !== selectedEstado) {
                return false;
            }
        }
        
        // Filtro por fecha
        if (dateRange) {
            const [startDate, endDate] = dateRange;
            const movDate = new Date(mov.createdAt);
            
            // Ajustar horas para comparación correcta
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            
            if (movDate < start || movDate > end) return false;
        }
        
        return true;
    });
}, [movimientosData, searchText, selectedMaquinaria, selectedEstado, dateRange, maquinariaData]);
    // Datos para gráficos
    const chartData = useMemo(() => {
        const dataByEstado: Record<string, number> = {};
        const dataByMes: Record<string, number> = {};
        
        filteredData.forEach(mov => {
            // Por estado
            const estado = mov.movimiento || 'Sin Estado';
            dataByEstado[estado] = (dataByEstado[estado] || 0) + 1;
            
            // Por mes
            const mes = moment(mov.createdAt).format('MMM YYYY');
            dataByMes[mes] = (dataByMes[mes] || 0) + 1;
        });
        
        return {
            porEstado: Object.entries(dataByEstado).map(([name, value]) => ({ name, value })),
            porMes: Object.entries(dataByMes).map(([name, value]) => ({ name, value })),
            total: filteredData.length,
        };
    }, [filteredData]);
    
    // Colores para gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    
    // Función para exportar a Excel
    const handleExportExcel = () => {
        const exportData = filteredData.map(mov => ({
            'N° Movimiento': mov.movimientoNumber,
            'Maquinaria': Array.isArray(mov.maquinaria) ? mov.maquinaria.join(', ') : mov.maquinaria,
            'Solicitante': mov.solicitante,
            'Autoriza': mov.autoriza,
            'Origen': Array.isArray(mov.origen) ? mov.origen.join(', ') : mov.origen,
            'Destino': Array.isArray(mov.traslado) ? mov.traslado.join(', ') : mov.traslado,
            'Estado': mov.movimiento,
            'Fecha Solicitud': mov.fechaS,
            'Fecha Traslado': mov.fechaT,
            'Fecha Creación': moment(mov.createdAt).format('DD/MM/YYYY HH:mm'),
        }));
        
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
        
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `movimientos_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
    };
    
    // Función para exportar a PDF (simplificado)
    const handleExportPDF = () => {
        // Aquí podrías integrar una librería como jsPDF
        alert("Exportación a PDF habilitada pronto");
    };
    
    // Función para limpiar filtros
    const handleClearFilters = () => {
        setSearchText("");
        setSelectedMaquinaria(null);
        setSelectedEstado(null);
        setDateRange(null);
        setCurrentPage(1);
    };
    
    // Paginación
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);
    
    // Estadísticas
    const stats = useMemo(() => ({
        total: filteredData.length,
        activos: filteredData.filter(m => m.movimiento === 'Activo').length,
        enTraslado: filteredData.filter(m => m.movimiento === 'EN_TRASLADO').length,
        finalizados: filteredData.filter(m => m.movimiento === 'FINALIZADO').length,
        ultimoMes: filteredData.filter(m => 
            moment(m.createdAt).isAfter(moment().subtract(30, 'days'))
        ).length,
    }), [filteredData]);
    
    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header del Dashboard */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="text-blue-600">📊</span>
                            Dashboard de Movimientos
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Visualice y analice todos los movimientos de maquinaria
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button
                            appearance="ghost"
                            className="border border-gray-300"
                            onClick={handleClearFilters}
                            disabled={!searchText && !selectedMaquinaria && !selectedEstado && !dateRange}
                        >
                            <Icon icon="refresh" className="mr-2" />
                            Limpiar Filtros
                        </Button>
                        
                        <Dropdown
                            title="Exportar"
                            appearance="primary"
                            className="bg-blue-600"
                        >
                            <Dropdown.Item onClick={handleExportExcel}>
                                <Icon icon="file-excel" className="mr-2" />
                                Exportar a Excel
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleExportPDF}>
                                <Icon icon="file-pdf" className="mr-2" />
                                Exportar a PDF
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                
                {/* Cards de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Movimientos</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <span className="text-blue-600 text-xl">📈</span>
                            </div>
                        </div>
                        <Progress.Line 
                            percent={100} 
                            strokeColor="#3B82F6" 
                            className="mt-2"
                        />
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Activos</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.activos}</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-green-600 text-xl">✅</span>
                            </div>
                        </div>
                        <Progress.Line 
                            percent={stats.total ? (stats.activos / stats.total) * 100 : 0} 
                            strokeColor="#10B981" 
                            className="mt-2"
                        />
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">En Traslado</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.enTraslado}</h3>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <span className="text-yellow-600 text-xl">🔄</span>
                            </div>
                        </div>
                        <Progress.Line 
                            percent={stats.total ? (stats.enTraslado / stats.total) * 100 : 0} 
                            strokeColor="#F59E0B" 
                            className="mt-2"
                        />
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Finalizados</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.finalizados}</h3>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <span className="text-purple-600 text-xl">🏁</span>
                            </div>
                        </div>
                        <Progress.Line 
                            percent={stats.total ? (stats.finalizados / stats.total) * 100 : 0} 
                            strokeColor="#8B5CF6" 
                            className="mt-2"
                        />
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Últimos 30 días</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.ultimoMes}</h3>
                            </div>
                            <div className="bg-pink-100 p-3 rounded-full">
                                <span className="text-pink-600 text-xl">📅</span>
                            </div>
                        </div>
                        <Progress.Line 
                            percent={stats.total ? (stats.ultimoMes / stats.total) * 100 : 0} 
                            strokeColor="#EC4899" 
                            className="mt-2"
                        />
                    </div>
                </div>
                
                {/* Filtros */}
                <Panel className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-blue-600">🔍</span>
                            Filtros de Búsqueda
                        </h3>
                    </div>
                    
                    <div className="p-4">
                        <Grid fluid>
                            <Row gutter={16}>
                                <Col xs={24} md={6}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Búsqueda General
                                        </label>
                                        <Input
                                            placeholder="Buscar por ID, solicitante, autoriza..."
                                            value={searchText}
                                            onChange={setSearchText}
                                            prefix="🔍"
                                        />
                                    </div>
                                </Col>
                                
                                <Col xs={24} md={6}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Maquinaria
                                        </label>
                                        <SelectPicker
                                            data={maquinariaOptions.map(opt => ({
                                                label: (
                                                    <div className="flex items-center">
                                                        
                                                        {opt.label}
                                                    </div>
                                                ),
                                                value: opt.value
                                            }))}
                                            value={selectedMaquinaria}
                                            onChange={setSelectedMaquinaria}
                                            placeholder="Todas las máquinas"
                                            searchable
                                            cleanable
                                            className="w-full"
                                        />
                                    </div>
                                </Col>
                                
                                <Col xs={24} md={6}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado
                                        </label>
                                        <SelectPicker
                                            data={estadoOptions}
                                            value={selectedEstado}
                                            onChange={setSelectedEstado}
                                            placeholder="Todos los estados"
                                            cleanable
                                            className="w-full"
                                        />
                                    </div>
                                </Col>
                                
                                <Col xs={24} md={6}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rango de Fechas
                                        </label>
                                        <DateRangePicker
                                            placeholder="Seleccionar rango"
                                            value={dateRange}
                                            onChange={setDateRange}
                                            className="w-full"
                                            format="dd/MM/yyyy"
                                            cleanable
                                        />
                                    </div>
                                </Col>
                            </Row>
                            
                            {/* Mostrar filtros activos */}
                            {(searchText || selectedMaquinaria || selectedEstado || dateRange) && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className="text-sm text-blue-700 font-medium">Filtros aplicados:</span>
                                            {searchText && (
                                                <Tag color="blue" className="flex items-center">
                                                    <Icon icon="search" className="mr-1" />
                                                    Búsqueda: "{searchText}"
                                                </Tag>
                                            )}
                                            {selectedMaquinaria && (
                                                <Tag color="green" className="flex items-center">
                                                    <Icon icon="cog" className="mr-1" />
                                                    Máquina: {maquinariaOptions.find(m => m.value === selectedMaquinaria)?.label}
                                                </Tag>
                                            )}
                                            {selectedEstado && (
                                                <Tag color="orange" className="flex items-center">
                                                    <Icon icon="flag" className="mr-1" />
                                                    Estado: {selectedEstado}
                                                </Tag>
                                            )}
                                            {dateRange && (
                                                <Tag color="orange" className="flex items-center">
                                                    <Icon icon="calendar" className="mr-1" />
                                                    Fechas: {moment(dateRange[0]).format('DD/MM/YY')} - {moment(dateRange[1]).format('DD/MM/YY')}
                                                </Tag>
                                            )}
                                        </div>
                                        <Button
                                            size="xs"
                                            appearance="ghost"
                                            onClick={handleClearFilters}
                                            className="text-blue-700"
                                        >
                                            Limpiar todos
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </div>
                </Panel>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico de pastel - Por Estado */}
                <Panel className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-700">📊 Distribución por Estado</h3>
                    </div>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData.porEstado}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.porEstado.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>
                
                {/* Gráfico de barras - Por Mes */}
                <Panel className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-700">📈 Movimientos por Mes</h3>
                    </div>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.porMes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" name="Cantidad" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>
            </div>
            
            {/* Tabla de Movimientos */}
            <Panel className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-700">📋 Lista de Movimientos</h3>
                        <p className="text-sm text-gray-500">
                            {filteredData.length} registros encontrados
                            {filteredData.length !== movimientosData?.movimientos?.length && 
                                ` (de ${movimientosData?.movimientos?.length || 0} total)`}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Mostrar:</span>
                        <SelectPicker
                            data={[10, 25, 50, 100].map(num => ({ label: `${num} por página`, value: num }))}
                            value={pageSize}
                            onChange={setPageSize}
                            size="xs"
                            cleanable={false}
                            style={{ width: 150 }}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    {loadingMovimientos ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader size="lg" />
                            <p className="mt-4 text-gray-600">Cargando movimientos...</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID Movimiento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Maquinaria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Solicitante / Autoriza
                                        </th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ruta
                                        </th> */}
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fechas
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((mov) => (
                                            <tr key={mov.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Tag color="blue" className="font-bold">
                                                        {mov.movimientoNumber || 'N/A'}
                                                    </Tag>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <span className="mr-2">{getMaquinariaIcon(mov.maquinaria?.[0] || '')}</span>
                                                        <span className="font-medium">
                                                            {Array.isArray(mov.maquinaria) ? mov.maquinaria.join(', ') : mov.maquinaria}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{mov.solicitante}</div>
                                                        <div className="text-sm text-gray-500">Autoriza: {mov.autoriza}</div>
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-600">De:</span>
                                                            <span className="font-medium ml-1">{Array.isArray(mov.origen) ? mov.origen.join(', ') : mov.origen}</span>
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-gray-600">A:</span>
                                                            <span className="font-medium ml-1">{Array.isArray(mov.traslado) ? mov.traslado.join(', ') : mov.traslado}</span>
                                                        </div>
                                                    </div>
                                                </td> */}
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                    <div color={
                                                        mov.movimiento === 'Activo' ? 'green' :
                                                        mov.movimiento === 'Inactivo' ? 'blue' : 'red'
                                                    }>
                                                        {mov.movimiento || 'Sin Estado'}
                                                    </div>
                                                </td> */}
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div>Solicitud: {mov.fechaS}</div>
                                                        <div>Traslado: {mov.fechaT}</div>
                                                        <div className="text-gray-500 text-xs">
                                                            Creado: {moment(mov.createdAt).format('DD/MM/YY HH:mm')}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="text-gray-400 text-4xl mb-2">📭</div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    No se encontraron movimientos
                                                </h3>
                                                <p className="text-gray-500">
                                                    {searchText || selectedMaquinaria || selectedEstado || dateRange
                                                        ? "Intenta con otros filtros de búsqueda"
                                                        : "No hay movimientos registrados"}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Paginación */}
                            {filteredData.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * pageSize, filteredData.length)}
                                        </span>{' '}
                                        de <span className="font-medium">{filteredData.length}</span> resultados
                                    </div>
                                    
                                    <Pagination
                                        prev
                                        next
                                        first
                                        last
                                        ellipsis
                                        boundaryLinks
                                        maxButtons={5}
                                        size="md"
                                        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                                        total={filteredData.length}
                                        limit={pageSize}
                                        limitOptions={[10, 25, 50, 100]}
                                        activePage={currentPage}
                                        onChangePage={setCurrentPage}
                                        onChangeLimit={setPageSize}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Panel>
            
            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                    Dashboard actualizado el {moment().format('DD/MM/YYYY HH:mm')} • 
                    Usuario: {user?.name || 'Sistema'} • 
                    Total registros en base: {movimientosData?.movimientos?.length || 0}
                </p>
            </div>
        </div>
    );
};

export default MovimientoDashboard;