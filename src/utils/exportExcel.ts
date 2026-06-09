// utils/exportExcel.ts
import ExcelJS from 'exceljs';
import type { EventoReporte, ResumenInfraestructura } from "../services/reporte.service";

interface ExportData {
  eventos: EventoReporte[];
  resumen: ResumenInfraestructura;
  clienteNombre: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const getTipoAlertaLabel = (detalle: string): string => {
  switch (detalle) {
    case "Baño sin papel": return "Sin Papel";
    case "Baño sucio": return "Sucio";
    case "mal olor": return "Mal Olor";
    case "Baño sin jabon": return "Sin Jabón";
    default: return detalle;
  }
};

const getGeneroLabel = (genero: string): string => {
  switch (genero) {
    case "men": return "Hombres";
    case "women": return "Mujeres";
    case "mixed": return "Mixto";
    case "disabled": return "Discapacitados";
    default: return genero;
  }
};

export const exportToExcel = async ({ eventos, resumen, clienteNombre, fechaInicio, fechaFin }: ExportData) => {
  // Crear libro de trabajo
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Nubeware IoT';
  workbook.created = new Date();

  // ==================== HOJA 1: RESUMEN GENERAL ====================
  const resumenSheet = workbook.addWorksheet('Resumen General');
  
  // Título
  resumenSheet.mergeCells('A1:B1');
  resumenSheet.getCell('A1').value = `Reporte de Métricas - ${clienteNombre}`;
  resumenSheet.getCell('A1').font = { size: 16, bold: true };
  resumenSheet.getCell('A1').alignment = { horizontal: 'center' };
  
  // Datos de resumen
  const totalIngresos = eventos.filter(e => e.tipo_evento === 'ingreso').reduce((acc, e) => acc + e.valor, 0);
  const totalAlertas = eventos.filter(e => e.tipo_evento === 'alerta').length;
  
  const resumenData = [
    ['Cliente', clienteNombre],
    ['Período', `${fechaInicio || 'Inicio'} - ${fechaFin || 'Fin'}`],
    ['', ''],
    ['Total Sedes', resumen.total_sedes],
    ['Total Niveles', resumen.total_levels],
    ['Total Baños', resumen.total_bathrooms],
    ['', ''],
    ['Total Ingresos', totalIngresos],
    ['Total Alertas', totalAlertas],
  ];
  
  resumenData.forEach((row, idx) => {
    const rowNum = idx + 3;
    resumenSheet.getCell(`A${rowNum}`).value = row[0];
    resumenSheet.getCell(`B${rowNum}`).value = row[1];
    if (row[0]) resumenSheet.getCell(`A${rowNum}`).font = { bold: true };
  });
  
  resumenSheet.getColumn('A').width = 20;
  resumenSheet.getColumn('B').width = 25;

  // ==================== HOJA 2: INGRESOS ====================
  const ingresosSheet = workbook.addWorksheet('Ingresos');
  
  // Encabezados
  ingresosSheet.columns = [
    { header: 'Fecha', key: 'fecha', width: 20 },
    { header: 'Sede', key: 'sede', width: 15 },
    { header: 'Nivel', key: 'nivel', width: 15 },
    { header: 'Género', key: 'genero', width: 12 },
    { header: 'Personas', key: 'personas', width: 10 },
  ];
  
  ingresosSheet.getRow(1).font = { bold: true };
  ingresosSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B5CF6' },
  };
  
  // Datos
  const ingresosData = eventos
    .filter(e => e.tipo_evento === 'ingreso')
    .map(e => ({
      fecha: new Date(e.fecha_hora).toLocaleString(),
      sede: e.sede,
      nivel: e.nivel,
      genero: getGeneroLabel(e.genero_bano),
      personas: e.valor,
    }));
  
  ingresosData.forEach(data => {
    ingresosSheet.addRow(data);
  });

  // ==================== HOJA 3: ALERTAS ====================
  const alertasSheet = workbook.addWorksheet('Alertas');
  
  alertasSheet.columns = [
    { header: 'Fecha', key: 'fecha', width: 20 },
    { header: 'Sede', key: 'sede', width: 15 },
    { header: 'Nivel', key: 'nivel', width: 15 },
    { header: 'Género', key: 'genero', width: 12 },
    { header: 'Alerta', key: 'alerta', width: 20 },
  ];
  
  alertasSheet.getRow(1).font = { bold: true };
  alertasSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF59E0B' },
  };
  
  const alertasData = eventos
    .filter(e => e.tipo_evento === 'alerta')
    .map(e => ({
      fecha: new Date(e.fecha_hora).toLocaleString(),
      sede: e.sede,
      nivel: e.nivel,
      genero: getGeneroLabel(e.genero_bano),
      alerta: getTipoAlertaLabel(e.detalle_evento),
    }));
  
  alertasData.forEach(data => {
    alertasSheet.addRow(data);
  });

  // ==================== HOJA 4: RESUMEN POR SEDE ====================
  const resumenSedeSheet = workbook.addWorksheet('Resumen por Sede');
  
  // Calcular estadísticas por sede
  const sedeStats = new Map<string, { ingresos: number; alertas: number }>();
  eventos.forEach(e => {
    if (!sedeStats.has(e.sede)) {
      sedeStats.set(e.sede, { ingresos: 0, alertas: 0 });
    }
    const stats = sedeStats.get(e.sede)!;
    if (e.tipo_evento === 'ingreso') {
      stats.ingresos += e.valor;
    } else {
      stats.alertas += 1;
    }
  });
  
  // Datos para la tabla
  const resumenSedeData = Array.from(sedeStats.entries()).map(([sede, stats]) => ({
    Sede: sede,
    Ingresos: stats.ingresos,
    Alertas: stats.alertas,
    'Porcentaje Alertas': stats.ingresos > 0 ? ((stats.alertas / stats.ingresos) * 100).toFixed(1) + '%' : '0%',
  }));
  
  // Encabezados
  resumenSedeSheet.columns = [
    { header: 'Sede', key: 'sede', width: 20 },
    { header: 'Ingresos', key: 'ingresos', width: 15 },
    { header: 'Alertas', key: 'alertas', width: 15 },
    { header: 'Porcentaje Alertas', key: 'porcentaje', width: 18 },
  ];
  
  resumenSedeSheet.getRow(1).font = { bold: true };
  resumenSedeSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF10B981' },
  };
  
  resumenSedeData.forEach(data => {
    resumenSedeSheet.addRow(data);
  });

  // ==================== HOJA 5: ALERTAS POR TIPO ====================
  const alertasTipoSheet = workbook.addWorksheet('Alertas por Tipo');
  
  // Calcular alertas por tipo
  const alertasPorTipo = new Map<string, number>();
  eventos.forEach(e => {
    if (e.tipo_evento === 'alerta') {
      const tipo = getTipoAlertaLabel(e.detalle_evento);
      alertasPorTipo.set(tipo, (alertasPorTipo.get(tipo) || 0) + 1);
    }
  });
  
  const alertasTipoData = Array.from(alertasPorTipo.entries()).map(([tipo, cantidad]) => ({
    Tipo: tipo,
    Cantidad: cantidad,
  }));
  
  alertasTipoSheet.columns = [
    { header: 'Tipo de Alerta', key: 'tipo', width: 25 },
    { header: 'Cantidad', key: 'cantidad', width: 15 },
  ];
  
  alertasTipoSheet.getRow(1).font = { bold: true };
  alertasTipoSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEF4444' },
  };
  
  alertasTipoData.forEach(data => {
    alertasTipoSheet.addRow(data);
  });

  // ==================== AGREGAR GRÁFICOS USANDO TABLAS ====================
  // Nota: exceljs no soporta gráficos nativamente de forma sencilla
  // En su lugar, creamos tablas formateadas que Excel puede convertir a gráficos fácilmente
  
  // Formato de tabla para Resumen por Sede
  resumenSedeSheet.addTable({
    name: 'TablaResumenSede',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: [
      { name: 'Sede', filterButton: true },
      { name: 'Ingresos', filterButton: true },
      { name: 'Alertas', filterButton: true },
      { name: 'Porcentaje Alertas', filterButton: true },
    ],
    rows: resumenSedeData.map(d => [d.Sede, d.Ingresos, d.Alertas, d['Porcentaje Alertas']]),
  });

  // Formato de tabla para Alertas por Tipo
  alertasTipoSheet.addTable({
    name: 'TablaAlertasTipo',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: {
      theme: 'TableStyleMedium6',
      showRowStripes: true,
    },
    columns: [
      { name: 'Tipo de Alerta', filterButton: true },
      { name: 'Cantidad', filterButton: true },
    ],
    rows: alertasTipoData.map(d => [d.Tipo, d.Cantidad]),
  });

  // Agregar instrucciones para crear gráficos manualmente
  const instruccionesSheet = workbook.addWorksheet('Instrucciones');
  instruccionesSheet.getCell('A1').value = 'Cómo crear gráficos en Excel:';
  instruccionesSheet.getCell('A1').font = { bold: true, size: 14 };
  instruccionesSheet.getCell('A3').value = '1. Selecciona los datos de la tabla "Resumen por Sede"';
  instruccionesSheet.getCell('A4').value = '2. Ve a Insertar > Gráfico > Barras';
  instruccionesSheet.getCell('A5').value = '3. Selecciona el tipo de gráfico que prefieras';
  instruccionesSheet.getCell('A7').value = 'O también puedes:';
  instruccionesSheet.getCell('A8').value = '1. Selecciona los datos de la tabla "Alertas por Tipo"';
  instruccionesSheet.getCell('A9').value = '2. Ve a Insertar > Gráfico > Pastel';
  instruccionesSheet.getColumn('A').width = 50;

  // ==================== DESCARGAR ARCHIVO ====================
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_${clienteNombre.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};