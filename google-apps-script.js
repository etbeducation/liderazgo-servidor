/**
 * Google Apps Script - Backend for Liderazgo Servidor Assessment
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet for storing responses
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire script
 * 4. Click Deploy > New Deployment
 * 5. Select "Web app" as deployment type
 * 6. Configure:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Click Deploy and authorize the script
 * 8. Copy the Web App URL
 * 9. Paste the URL in js/sheets.js (replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE)
 * 
 * The script will automatically create necessary sheets and headers.
 */

/**
 * Handle POST requests from the web form
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Initialize sheets if needed
    initializeSheets();
    
    // Save to main responses sheet
    saveMainResponse(data);
    
    // Save individual responses to detailed sheet
    saveDetailedResponse(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Datos guardados exitosamente' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'Error al guardar datos: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script está funcionando correctamente. Use POST para enviar datos.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Initialize sheets if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create main responses sheet
  let mainSheet = ss.getSheetByName('Respuestas');
  if (!mainSheet) {
    mainSheet = ss.insertSheet('Respuestas');
    
    // Set headers for main sheet
    const mainHeaders = [
      'Timestamp',
      'Fecha',
      'Hora',
      'Nombre',
      'Email',
      'Puntaje Total',
      'Interpretación',
      'Categoría',
      'Dim 1: Identidad y misión',
      'Dim 2: Escucha y acompañamiento',
      'Dim 3: Corresponsabilidad',
      'Dim 4: Formación y crecimiento',
      'Dim 5: Discernimiento y justicia',
      'Fortaleza (Dimensión)',
      'Fortaleza (Puntaje)',
      'Área de Mejora (Dimensión)',
      'Área de Mejora (Puntaje)'
    ];
    
    mainSheet.getRange(1, 1, 1, mainHeaders.length).setValues([mainHeaders]);
    formatHeaderRow(mainSheet);
  }
  
  // Create detailed responses sheet
  let detailedSheet = ss.getSheetByName('Respuestas Detalladas');
  if (!detailedSheet) {
    detailedSheet = ss.insertSheet('Respuestas Detalladas');
    
    // Set headers for detailed sheet
    const detailedHeaders = [
      'Timestamp',
      'Nombre',
      'Email',
      'Q1', 'Q2', 'Q3', 'Q4',  // Dimension I
      'Q5', 'Q6', 'Q7', 'Q8',  // Dimension II
      'Q9', 'Q10', 'Q11', 'Q12',  // Dimension III
      'Q13', 'Q14', 'Q15', 'Q16',  // Dimension IV
      'Q17', 'Q18', 'Q19', 'Q20',  // Dimension V
      'Puntaje Total'
    ];
    
    detailedSheet.getRange(1, 1, 1, detailedHeaders.length).setValues([detailedHeaders]);
    formatHeaderRow(detailedSheet);
  }
}

/**
 * Format header row
 */
function formatHeaderRow(sheet) {
  const lastColumn = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastColumn);
  
  headerRange.setBackground('#2563eb');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Save main response summary
 */
function saveMainResponse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Respuestas');
  
  const row = [
    data.timestamp,
    data.dateFormatted,
    data.timeFormatted,
    data.nombre,
    data.email,
    data.puntajeTotal,
    data.interpretacion,
    data.categoria,
    data.dim1_score,
    data.dim2_score,
    data.dim3_score,
    data.dim4_score,
    data.dim5_score,
    data.fortaleza_dimension,
    data.fortaleza_puntaje,
    data.debilidad_dimension,
    data.debilidad_puntaje
  ];
  
  sheet.appendRow(row);
  
  // Format the new row
  const lastRow = sheet.getLastRow();
  
  // Alternate row colors for better readability
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, row.length).setBackground('#f8fafc');
  }
  
  // Center align certain columns
  sheet.getRange(lastRow, 6, 1, 1).setHorizontalAlignment('center'); // Puntaje Total
  sheet.getRange(lastRow, 9, 1, 5).setHorizontalAlignment('center'); // Dimension scores
  
  // Bold the total score
  sheet.getRange(lastRow, 6, 1, 1).setFontWeight('bold');
  
  // Add conditional formatting for category
  const categoryCell = sheet.getRange(lastRow, 8);
  switch(data.categoria) {
    case 'excellent':
      categoryCell.setBackground('#d1fae5').setFontColor('#065f46');
      break;
    case 'good':
      categoryCell.setBackground('#dbeafe').setFontColor('#1e40af');
      break;
    case 'fair':
      categoryCell.setBackground('#fef3c7').setFontColor('#92400e');
      break;
    case 'needs-improvement':
      categoryCell.setBackground('#fee2e2').setFontColor('#991b1b');
      break;
  }
}

/**
 * Save detailed individual responses
 */
function saveDetailedResponse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Respuestas Detalladas');
  
  const row = [
    data.timestamp,
    data.nombre,
    data.email
  ];
  
  // Add all 20 individual responses
  for (let i = 0; i < data.responses.length; i++) {
    row.push(data.responses[i]);
  }
  
  // Add total score
  row.push(data.puntajeTotal);
  
  sheet.appendRow(row);
  
  // Format the new row
  const lastRow = sheet.getLastRow();
  
  // Alternate row colors
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, row.length).setBackground('#f8fafc');
  }
  
  // Center align response columns
  sheet.getRange(lastRow, 4, 1, 21).setHorizontalAlignment('center');
  
  // Bold the total score
  sheet.getRange(lastRow, 24, 1, 1).setFontWeight('bold');
  
  // Color code individual responses
  const responseRange = sheet.getRange(lastRow, 4, 1, 20);
  const values = responseRange.getValues()[0];
  
  for (let i = 0; i < values.length; i++) {
    const cell = sheet.getRange(lastRow, 4 + i);
    const value = values[i];
    
    // Color code based on value
    if (value >= 4) {
      cell.setBackground('#d1fae5'); // Green for 4-5
    } else if (value === 3) {
      cell.setBackground('#fef3c7'); // Yellow for 3
    } else if (value <= 2) {
      cell.setBackground('#fee2e2'); // Red for 1-2
    }
  }
}

/**
 * Create a summary dashboard (optional utility function)
 * Run this manually to create summary statistics
 */
function createSummaryDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let dashboardSheet = ss.getSheetByName('Dashboard');
  if (!dashboardSheet) {
    dashboardSheet = ss.insertSheet('Dashboard');
  } else {
    dashboardSheet.clear();
  }
  
  // Add summary statistics
  dashboardSheet.getRange('A1').setValue('RESUMEN DE EVALUACIONES');
  dashboardSheet.getRange('A1').setFontSize(16).setFontWeight('bold');
  
  dashboardSheet.getRange('A3').setValue('Total de Evaluaciones:');
  dashboardSheet.getRange('B3').setFormula('=COUNTA(Respuestas!A:A)-1');
  
  dashboardSheet.getRange('A4').setValue('Promedio Puntaje Total:');
  dashboardSheet.getRange('B4').setFormula('=AVERAGE(Respuestas!F:F)').setNumberFormat('0.00');
  
  dashboardSheet.getRange('A6').setValue('Distribución por Categoría:');
  dashboardSheet.getRange('A7').setValue('Excelente:');
  dashboardSheet.getRange('B7').setFormula('=COUNTIF(Respuestas!H:H,"excellent")');
  dashboardSheet.getRange('A8').setValue('Bueno:');
  dashboardSheet.getRange('B8').setFormula('=COUNTIF(Respuestas!H:H,"good")');
  dashboardSheet.getRange('A9').setValue('Regular:');
  dashboardSheet.getRange('B9').setFormula('=COUNTIF(Respuestas!H:H,"fair")');
  dashboardSheet.getRange('A10').setValue('Necesita Mejora:');
  dashboardSheet.getRange('B10').setFormula('=COUNTIF(Respuestas!H:H,"needs-improvement")');
  
  dashboardSheet.getRange('A12').setValue('Promedio por Dimensión:');
  dashboardSheet.getRange('A13').setValue('Dim 1 - Identidad y misión:');
  dashboardSheet.getRange('B13').setFormula('=AVERAGE(Respuestas!I:I)').setNumberFormat('0.00');
  dashboardSheet.getRange('A14').setValue('Dim 2 - Escucha y acompañamiento:');
  dashboardSheet.getRange('B14').setFormula('=AVERAGE(Respuestas!J:J)').setNumberFormat('0.00');
  dashboardSheet.getRange('A15').setValue('Dim 3 - Corresponsabilidad:');
  dashboardSheet.getRange('B15').setFormula('=AVERAGE(Respuestas!K:K)').setNumberFormat('0.00');
  dashboardSheet.getRange('A16').setValue('Dim 4 - Formación y crecimiento:');
  dashboardSheet.getRange('B16').setFormula('=AVERAGE(Respuestas!L:L)').setNumberFormat('0.00');
  dashboardSheet.getRange('A17').setValue('Dim 5 - Discernimiento y justicia:');
  dashboardSheet.getRange('B17').setFormula('=AVERAGE(Respuestas!M:M)').setNumberFormat('0.00');
  
  // Auto-resize columns
  dashboardSheet.autoResizeColumns(1, 2);
  
  SpreadsheetApp.getUi().alert('Dashboard creado exitosamente');
}
