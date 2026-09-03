/**
 * Convert an array of flat objects into a CSV string and trigger a browser download.
 */
export function toCsv<T extends object>(rows: T[], columns?: (keyof T)[]): string {
  if (rows.length === 0) return ''
  const keys = columns ?? (Object.keys(rows[0]) as (keyof T)[])

  const escapeCell = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const header = keys.map((k) => escapeCell(String(k))).join(',')
  const body = rows.map((row) => keys.map((k) => escapeCell(row[k])).join(',')).join('\n')
  return `${header}\n${body}`
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportRowsAsCsv<T extends object>(
  rows: T[],
  filename: string,
  columns?: (keyof T)[],
): void {
  const csv = toCsv(rows, columns)
  downloadCsv(filename, csv)
}
