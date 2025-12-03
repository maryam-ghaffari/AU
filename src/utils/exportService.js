// Export service for exporting bookings to PDF and Excel/CSV

/**
 * Export bookings to PDF
 * @param {Array} bookings - Array of bookings to export
 * @param {Object} options - Export options
 */
export function exportToPDF(bookings, options = {}) {
  // Create a simple PDF using browser's print functionality
  // In a real app, you would use a library like jsPDF or pdfmake
  
  const printWindow = window.open('', '_blank')
  const htmlContent = generatePDFHTML(bookings, options)
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      // Optionally close after printing
      // printWindow.close()
    }, 250)
  }
}

/**
 * Export bookings to CSV/Excel
 * @param {Array} bookings - Array of bookings to export
 * @param {string} filename - Name of the file
 */
export function exportToCSV(bookings, filename = 'bokningar') {
  // Create CSV content
  const headers = [
    'Bokningsnummer',
    'Kund',
    'E-post',
    'Telefon',
    'Registreringsnummer',
    'Service',
    'Datum',
    'Tid',
    'Status',
    'Utförd åtgärd'
  ]
  
  const rows = bookings.map(booking => [
    booking.id,
    booking.customerName,
    booking.email,
    booking.phone,
    booking.registrationNumber,
    booking.serviceType,
    formatDate(booking.date),
    booking.time,
    getStatusText(booking.status),
    booking.completedAction || ''
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')
  
  // Add BOM for UTF-8 to ensure Excel opens it correctly
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${formatDateForFilename(new Date())}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate HTML content for PDF
 * @param {Array} bookings - Array of bookings
 * @param {Object} options - Export options
 * @returns {string} HTML content
 */
function generatePDFHTML(bookings, options) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const title = options.title || 'Bokningar'
  const subtitle = options.subtitle || ''
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @media print {
      @page {
        margin: 2cm;
      }
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      border-bottom: 3px solid #3498db;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .info {
      margin-bottom: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #2c3e50;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .status-completed {
      background-color: #d4edda;
      color: #155724;
    }
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    .status-in_progress {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    .status-cancelled {
      background-color: #f8d7da;
      color: #721c24;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Bil- och Däckfirma</h1>
    <p>${title}</p>
    ${subtitle ? `<p>${subtitle}</p>` : ''}
    <p>Exporterad: ${dateStr}</p>
  </div>
  
  <div class="info">
    <strong>Antal bokningar:</strong> ${bookings.length}
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Bokningsnr</th>
        <th>Kund</th>
        <th>Registreringsnummer</th>
        <th>Service</th>
        <th>Datum</th>
        <th>Tid</th>
        <th>Status</th>
        <th>Utförd åtgärd</th>
      </tr>
    </thead>
    <tbody>
  `
  
  bookings.forEach(booking => {
    html += `
      <tr>
        <td>#${booking.id}</td>
        <td>${escapeHtml(booking.customerName)}</td>
        <td>${booking.registrationNumber}</td>
        <td>${escapeHtml(booking.serviceType)}</td>
        <td>${formatDate(booking.date)}</td>
        <td>${booking.time}</td>
        <td><span class="status status-${booking.status}">${getStatusText(booking.status)}</span></td>
        <td>${escapeHtml(booking.completedAction || '-')}</td>
      </tr>
    `
  })
  
  html += `
    </tbody>
  </table>
  
  <div class="footer">
    <p>Bil- och Däckfirma | Servicegatan 123, 123 45 Stockholm | Tel: 08-123 45 67</p>
  </div>
</body>
</html>
  `
  
  return html
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date for filename
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDateForFilename(date) {
  return date.toISOString().split('T')[0]
}

/**
 * Get status text in Swedish
 * @param {string} status - Status code
 * @returns {string} Status text
 */
function getStatusText(status) {
  const statusMap = {
    pending: 'Väntande',
    in_progress: 'Pågående',
    completed: 'Avslutad',
    cancelled: 'Avbokad'
  }
  return statusMap[status] || status
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}




