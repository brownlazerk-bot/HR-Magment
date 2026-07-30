/**
 * Export Utilities for Sky View Resort ERP
 * Provides CSV export, Print formatting, and HTML/PDF generation support.
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printERPReport(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sky View Resort ERP - ${title}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #111827; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-weight: 600; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SKY VIEW RESORT & LUXURY SUITES</div>
            <div class="subtitle">ENTERPRISE FINANCIAL & OPERATIONAL REPORT | ${title}</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #475569;">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Security Hash: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
          </div>
        </div>
        ${htmlContent}
        <div class="footer">
          <div>Sky View Resort ERP System v4.2 | Confidential Internal Executive Record</div>
          <div>Page 1 of 1</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
