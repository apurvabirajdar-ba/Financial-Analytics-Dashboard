export const generateCSV = (data: any[], columns: string[]): string => {
  const headers = columns.join(',');
  const rows = data.map(row => {
    return columns.map(col => {
      const rawValue = row[col] instanceof Date ? row[col].toISOString() : row[col];
      const value = rawValue === undefined || rawValue === null ? '' : String(rawValue);
      return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',');
  });
  return [headers, ...rows].join('\n');
};
