import Papa from 'papaparse';

export function parseCSV(text, options = {}) {
  return Papa.parse(text, { ...options });
}

export function serializeCSV(data, options = {}) {
  return Papa.unparse(data, { ...options });
}
