/**
 * Converts a date string in YYYY-MM format to 'Mon YYYY' format
 * @param dateStr - Date string in format 'YYYY-MM' or 'YYYY'
 * @returns Formatted date string like 'Aug 2025'
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  const parts = dateStr.split('-');
  const year = parts[0];
  const month = parts[1];
  
  if (!year) return '';
  
  // If no month, just return year
  if (!month) return year;
  
  const monthNum = parseInt(month, 10);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthStr = months[monthNum - 1] || '';
  return monthStr ? `${monthStr} ${year}` : year;
}

/**
 * Formats a date range with start and optional end date
 * @param startDate - Start date in 'YYYY-MM' format
 * @param endDate - Optional end date in 'YYYY-MM' format
 * @returns Formatted date range like 'Aug 2025 – Present' or 'Aug 2025 – Oct 2025'
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} – ${end}`;
}
