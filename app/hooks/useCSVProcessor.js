import { useState } from 'react';
import Papa from 'papaparse';

export default function useCSVProcessor() {
  const [result, setResult] = useState({
    headers: [],
    rows: [],
    formatted: '',
    stats: { rowCount: 0, columnCount: 0, cellCount: 0 },
    extraction: null,
    error: null
  });

  function processCSV(csvText, transformations, options, extractionOptions) {
    try {
      const parsed = Papa.parse(csvText, { skipEmptyLines: options.skipEmptyRows });
      let [headers, ...rows] = parsed.data;
      if (!headers || !rows) throw new Error('Invalid CSV');
      // Transform columns
      let newHeaders = [...headers];
      let newRows = rows.map(row => [...row]);
      // Remove columns if needed
      transformations.forEach((t, i) => {
        if (t.type === 'remove') {
          newHeaders[i] = null;
          newRows.forEach(row => row[i] = null);
        }
      });
      newHeaders = newHeaders.filter(h => h !== null);
      newRows = newRows.map(row => row.filter((_, i) => transformations[i]?.type !== 'remove'));
      // Apply transformations
      newRows = newRows.map(row => row.map((cell, i) => {
        let t = transformations[i];
        if (!t || t.type === 'none') return options.trimWhitespace ? cell.trim() : cell;
        let val = options.trimWhitespace ? cell.trim() : cell;
        switch (t.type) {
          case 'uppercase': return val.toUpperCase();
          case 'lowercase': return val.toLowerCase();
          case 'capitalize': return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
          case 'trim': return val.trim();
          case 'number': return Number(val).toLocaleString(undefined, t.format ? { minimumFractionDigits: Number(t.format) } : {});
          case 'currency': return Number(val).toLocaleString(undefined, { style: 'currency', currency: t.format || 'USD' });
          case 'date': return new Date(val).toLocaleDateString(undefined, t.format ? { dateStyle: t.format } : {});
          default: return val;
        }
      }));
      // Extraction
      let extraction = null;
      if (extractionOptions.enabled) {
        let colIdx = Number(extractionOptions.columnIndex);
        let values = newRows.map(row => row[colIdx]);
        if (extractionOptions.uniqueOnly) values = [...new Set(values)];
        let sep = extractionOptions.format === 'comma' ? ', ' : extractionOptions.format === 'newline' ? '\n' : extractionOptions.format === 'semicolon' ? '; ' : extractionOptions.customSeparator;
        extraction = {
          values: values.join(sep),
          count: values.length,
          columnName: newHeaders[colIdx]
        };
      }
      // Format CSV
      const formatted = Papa.unparse([newHeaders, ...newRows]);
      setResult({
        headers: newHeaders,
        rows: newRows,
        formatted,
        stats: {
          rowCount: newRows.length,
          columnCount: newHeaders.length,
          cellCount: newRows.length * newHeaders.length
        },
        extraction,
        error: null
      });
    } catch (error) {
      setResult(r => ({ ...r, error: error.message }));
    }
  }

  function reset() {
    setResult({
      headers: [],
      rows: [],
      formatted: '',
      stats: { rowCount: 0, columnCount: 0, cellCount: 0 },
      extraction: null,
      error: null
    });
  }

  return { ...result, processCSV, reset };
}
