import { format, formatDistanceToNow, formatRelative } from "date-fns";
import { he } from "date-fns/locale";

// תאריך + שעה (לשדה createdAt)
// export function formatDateWithTime(dateString) {
//   if (!dateString) return "";
//   return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: he });
// }

// תאריך בלבד
export function formatDateOnly(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "dd/MM/yyyy", { locale: he });
}

// תאריך מילולי: 10 באפריל 2025
export function formatDateInWords(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "d 'ב'MMMM yyyy", { locale: he });
}

// תאריך כולל יום בשבוע: יום חמישי, 10 באפריל 2025
export function formatDateWithDayName(date) {
  if (!date) return '';
  
  const localDate = new Date(date);
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const dayName = days[localDate.getDay()];
  
  // פורמט התאריך לפי זמן מקומי
  const day = String(localDate.getDate()).padStart(2, '0');
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const year = localDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return `${dayName}, ${formattedDate}`;
}

export function formatDateWithTime(date) {
  if (!date) return '';
  
  const localDate = new Date(date);
  
  // פורמט התאריך והשעה לפי זמן מקומי
  const day = String(localDate.getDate()).padStart(2, '0');
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const year = localDate.getFullYear();
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatDistanceFromNow(date) {
  if (!date) return '';
  
  const localDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - localDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'היום';
  if (diffDays === 1) return 'אתמול';
  return `לפני ${diffDays} ימים`;
}

export function formatRelativeDate(date) {
  if (!date) return '';
  
  const localDate = new Date(date);
  return localDate.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// תאריך יחסי – למשל: אתמול ב-16:00
// export function formatRelativeDate(dateString) {
//   if (!dateString) return "";
//   return formatRelative(new Date(dateString), new Date(), { locale: he });
// }
